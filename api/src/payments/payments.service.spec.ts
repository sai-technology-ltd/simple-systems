import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, ProductType } from '@prisma/client';
import { createHmac } from 'crypto';
import { ClientService } from '../client.service';
import { PaymentsService } from './payments.service';

function jsonResponse<T>(body: T) {
  return {
    ok: true,
    json: () => Promise.resolve(body),
  };
}

describe('PaymentsService', () => {
  let service: PaymentsService;
  let config: jest.Mocked<ConfigService>;
  let clients: jest.Mocked<ClientService>;
  let values: Record<string, unknown>;

  beforeEach(() => {
    values = {
      PAYMENT_PROVIDER: 'LEMON_SQUEEZY',
      LEMON_SQUEEZY_API_KEY: 'ls_api_key',
      LEMON_SQUEEZY_STORE_ID: 12,
      LEMON_SQUEEZY_VARIANT_ID: 34,
      LEMON_SQUEEZY_WEBHOOK_SECRET: 'webhook_secret',
      LEMON_SQUEEZY_DEFAULT_AMOUNT: 500000,
      LEMON_SQUEEZY_TEST_MODE: true,
      PADDLE_API_KEY: 'pdl_api_key',
      PADDLE_PRICE_ID: 'pri_123',
      PADDLE_WEBHOOK_SECRET: 'paddle_secret',
      PADDLE_DEFAULT_AMOUNT: 500000,
      PADDLE_DEFAULT_CURRENCY_CODE: 'USD',
      PAYSTACK_SECRET_KEY: 'paystack_secret',
      PAYSTACK_DEFAULT_AMOUNT: 500000,
      PAYSTACK_DEFAULT_CURRENCY_CODE: 'NGN',
    };
    config = {
      get: jest.fn((key: string) => values[key]),
    } as unknown as jest.Mocked<ConfigService>;

    clients = {
      findActiveBySlug: jest.fn(),
      updatePaymentReference: jest.fn(),
      getBySlug: jest.fn(),
      markPaymentPaid: jest.fn(),
    } as unknown as jest.Mocked<ClientService>;

    service = new PaymentsService(config, clients);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a Lemon Squeezy checkout and stores the local reference', async () => {
    const fetchMock = global.fetch as jest.Mock;

    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      productType: ProductType.HIRING,
    } as never);
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          id: 'checkout_123',
          attributes: {
            url: 'https://store.lemonsqueezy.com/checkout/custom/abc',
            custom_price: 500000,
          },
        },
      }),
    );

    const result: unknown = await service.initialize('swift-transport', {
      email: 'owner@example.com',
      callbackUrl: 'https://app.example.com/billing/complete',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.lemonsqueezy.com/v1/checkouts',
      expect.objectContaining({
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.objectContaining<Record<string, string>>({
          Authorization: 'Bearer ls_api_key',
          Accept: 'application/vnd.api+json',
        }),
      }),
    );
    expect(clients.updatePaymentReference.mock.calls).toContainEqual([
      'client-1',
      expect.stringMatching(/^ss_swift-transport_\d+$/),
    ]);
    expect(result).toEqual(
      expect.objectContaining({
        authorizationUrl: 'https://store.lemonsqueezy.com/checkout/custom/abc',
        checkoutUrl: 'https://store.lemonsqueezy.com/checkout/custom/abc',
        checkoutId: 'checkout_123',
        accessCode: null,
        amount: 500000,
      }),
    );
  });

  it('creates a Paddle checkout when Paddle is the active provider', async () => {
    const fetchMock = global.fetch as jest.Mock;

    values.PAYMENT_PROVIDER = 'PADDLE';
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      productType: ProductType.HIRING,
    } as never);
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          id: 'txn_123',
          status: 'draft',
          checkout: {
            url: 'https://pay.example.com/checkout?_ptxn=txn_123',
          },
        },
      }),
    );

    const result: unknown = await service.initialize('swift-transport', {
      email: 'owner@example.com',
      callbackUrl: 'https://app.example.com/pay',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.paddle.com/transactions',
      expect.objectContaining({
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.objectContaining<Record<string, string>>({
          Authorization: 'Bearer pdl_api_key',
          Accept: 'application/json',
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        provider: 'paddle',
        checkoutMode: 'overlay',
        authorizationUrl: 'https://pay.example.com/checkout?_ptxn=txn_123',
        checkoutId: 'txn_123',
        amount: 500000,
      }),
    );
  });

  it('creates a Paystack checkout when Paystack is the active provider', async () => {
    const fetchMock = global.fetch as jest.Mock;

    values.PAYMENT_PROVIDER = 'PAYSTACK';
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      productType: ProductType.HIRING,
    } as never);
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          authorization_url: 'https://checkout.paystack.com/example',
          access_code: 'access_123',
          reference: 'ss_swift-transport_123',
        },
      }),
    );

    const result: unknown = await service.initialize('swift-transport', {
      email: 'owner@example.com',
      callbackUrl: 'https://app.example.com/pay',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.paystack.co/transaction/initialize',
      expect.objectContaining({
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: expect.objectContaining<Record<string, string>>({
          Authorization: 'Bearer paystack_secret',
          Accept: 'application/json',
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        provider: 'paystack',
        checkoutMode: 'popup',
        authorizationUrl: 'https://checkout.paystack.com/example',
        accessCode: 'access_123',
        reference: 'ss_swift-transport_123',
        amount: 500000,
      }),
    );
  });

  it('returns local payment status for a matching reference', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      paymentReference: 'ss_swift_1',
      paymentStatus: PaymentStatus.PAID,
      paymentAmount: 500000,
      updatedAt: new Date('2026-03-06T12:00:00.000Z'),
    } as never);

    await expect(
      service.verify('swift-transport', 'ss_swift_1'),
    ).resolves.toEqual({
      paid: true,
      status: 'paid',
      provider: 'lemonsqueezy',
      reference: 'ss_swift_1',
      amount: 500000,
      paidAt: '2026-03-06T12:00:00.000Z',
    });
  });

  it('rejects verify when the reference does not belong to the client', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      paymentReference: 'ss_other_1',
      paymentStatus: PaymentStatus.PENDING,
      updatedAt: new Date('2026-03-06T12:00:00.000Z'),
    } as never);

    await expect(
      service.verify('swift-transport', 'ss_swift_1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects webhook requests with an invalid signature', async () => {
    await expect(
      service.handleLemonSqueezyWebhook(
        '{"meta":{"event_name":"order_created"}}',
        'bad-signature',
        'order_created',
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('marks the client paid when a valid order_created webhook arrives', async () => {
    const payload = JSON.stringify({
      meta: {
        event_name: 'order_created',
        custom_data: {
          clientSlug: 'swift-transport',
          reference: 'ss_swift_2',
        },
      },
      data: {
        id: '1',
        type: 'orders',
        attributes: {
          identifier: 'order_123',
          user_email: 'owner@example.com',
          total: 500000,
          status: 'paid',
        },
      },
    });
    const signature = createHmac('sha256', 'webhook_secret')
      .update(payload)
      .digest('hex');
    clients.getBySlug.mockResolvedValue({ id: 'client-1' } as never);

    await expect(
      service.handleLemonSqueezyWebhook(payload, signature, 'order_created'),
    ).resolves.toEqual({
      received: true,
      processed: true,
      provider: 'lemonsqueezy',
      event: 'order_created',
      reference: 'ss_swift_2',
    });
    expect(clients.markPaymentPaid.mock.calls).toContainEqual([
      'client-1',
      {
        reference: 'ss_swift_2',
        email: 'owner@example.com',
        amount: 500000,
      },
    ]);
  });

  it('marks the client paid when a valid Paddle webhook arrives', async () => {
    const payload = JSON.stringify({
      event_type: 'transaction.completed',
      data: {
        id: 'txn_123',
        status: 'completed',
        custom_data: {
          clientSlug: 'swift-transport',
          reference: 'ss_swift_3',
        },
        customer: {
          email: 'owner@example.com',
        },
        details: {
          totals: {
            total: 500000,
          },
        },
      },
    });
    const timestamp = '1671552777';
    const signature = createHmac('sha256', 'paddle_secret')
      .update(`${timestamp}:${payload}`)
      .digest('hex');
    clients.getBySlug.mockResolvedValue({ id: 'client-1' } as never);

    await expect(
      service.handlePaddleWebhook(payload, `ts=${timestamp};h1=${signature}`),
    ).resolves.toEqual({
      received: true,
      processed: true,
      provider: 'paddle',
      event: 'transaction.completed',
      reference: 'ss_swift_3',
    });
    expect(clients.markPaymentPaid.mock.calls).toContainEqual([
      'client-1',
      {
        reference: 'ss_swift_3',
        email: 'owner@example.com',
        amount: 500000,
      },
    ]);
  });

  it('verifies a Paystack payment against the provider when local status is still pending', async () => {
    const fetchMock = global.fetch as jest.Mock;

    values.PAYMENT_PROVIDER = 'PAYSTACK';
    clients.findActiveBySlug.mockResolvedValue({
      id: 'client-1',
      paymentReference: 'ss_swift_4',
      paymentStatus: PaymentStatus.PENDING,
      updatedAt: new Date('2026-03-06T12:00:00.000Z'),
    } as never);
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          status: 'success',
          reference: 'ss_swift_4',
          amount: 500000,
          customer: {
            email: 'owner@example.com',
          },
        },
      }),
    );

    await expect(
      service.verify('swift-transport', 'ss_swift_4'),
    ).resolves.toEqual({
      paid: true,
      status: 'paid',
      provider: 'paystack',
      reference: 'ss_swift_4',
      amount: 500000,
      paidAt: expect.any(String) as string,
    });
    expect(clients.markPaymentPaid.mock.calls).toContainEqual([
      'client-1',
      {
        reference: 'ss_swift_4',
        email: 'owner@example.com',
        amount: 500000,
      },
    ]);
  });

  it('marks the client paid when a valid Paystack webhook arrives', async () => {
    const payload = JSON.stringify({
      event: 'charge.success',
      data: {
        status: 'success',
        reference: 'ss_swift_5',
        amount: 500000,
        customer: {
          email: 'owner@example.com',
        },
        metadata: {
          clientSlug: 'swift-transport',
          reference: 'ss_swift_5',
        },
      },
    });
    const signature = createHmac('sha512', 'paystack_secret')
      .update(payload)
      .digest('hex');
    clients.getBySlug.mockResolvedValue({ id: 'client-1' } as never);

    await expect(
      service.handlePaystackWebhook(payload, signature),
    ).resolves.toEqual({
      received: true,
      processed: true,
      provider: 'paystack',
      event: 'charge.success',
      reference: 'ss_swift_5',
    });
    expect(clients.markPaymentPaid.mock.calls).toContainEqual([
      'client-1',
      {
        reference: 'ss_swift_5',
        email: 'owner@example.com',
        amount: 500000,
      },
    ]);
  });
});
