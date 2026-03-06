import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ApplyController } from './apply.controller';
import { ClientService } from '../client.service';
import { NotionService } from '../notion/notion.service';
import { HiringIntakeService } from '../webhooks/hiring-intake.service';

describe('ApplyController', () => {
  let controller: ApplyController;
  let clients: jest.Mocked<ClientService>;
  let notion: jest.Mocked<NotionService>;
  let intake: jest.Mocked<HiringIntakeService>;

  beforeEach(() => {
    clients = {
      findActiveBySlug: jest.fn(),
    } as unknown as jest.Mocked<ClientService>;

    notion = {
      findRoleBySlug: jest.fn(),
    } as unknown as jest.Mocked<NotionService>;

    intake = {
      process: jest.fn(),
    } as unknown as jest.Mocked<HiringIntakeService>;

    controller = new ApplyController(clients, notion, intake);
  });

  it('returns basic role metadata for GET resolve', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({
      results: [
        {
          id: 'role-page-1',
          properties: {
            'Role Name': {
              title: [{ plain_text: 'Backend Engineer' }],
            },
          },
        },
      ],
    } as never);

    await expect(controller.resolve('swift-transport', 'backend-engineer')).resolves.toEqual({
      clientSlug: 'swift-transport',
      roleSlug: 'backend-engineer',
      rolePageId: 'role-page-1',
      roleName: 'Backend Engineer',
    });
  });

  it('submits an application through the intake service', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({
      results: [{ id: 'role-page-1', properties: {} }],
    } as never);
    intake.process.mockResolvedValue({ ok: true } as never);

    const response = await controller.submit('swift-transport', 'backend-engineer', {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+15550000000',
      cvUrl: 'https://example.com/cv.pdf',
      notes: 'Five years of experience.',
    });

    expect(intake.process).toHaveBeenCalledWith(
      'swift-transport',
      expect.objectContaining({
        roleId: 'role-page-1',
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
        phone: '+15550000000',
        cvUrl: 'https://example.com/cv.pdf',
        notes: 'Five years of experience.',
      }),
    );
    expect(response).toEqual({ ok: true });
  });

  it('throws when the role does not exist', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({ results: [] } as never);

    await expect(
      controller.submit('swift-transport', 'missing-role', {
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws on GET resolve when the role does not exist', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({ results: [] } as never);

    await expect(controller.resolve('swift-transport', 'missing-role')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when the client is not configured for hiring roles', async () => {
    clients.findActiveBySlug.mockResolvedValue(null as never);

    await expect(controller.resolve('swift-transport', 'backend-engineer')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('falls back to the Name property when Role Name is missing', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PAID,
    } as never);
    notion.findRoleBySlug.mockResolvedValue({
      results: [
        {
          id: 'role-page-1',
          properties: {
            Name: {
              title: [{ plain_text: 'Platform Engineer' }],
            },
          },
        },
      ],
    } as never);

    await expect(controller.resolve('swift-transport', 'platform-engineer')).resolves.toEqual({
      clientSlug: 'swift-transport',
      roleSlug: 'platform-engineer',
      rolePageId: 'role-page-1',
      roleName: 'Platform Engineer',
    });
  });

  it('throws on submit when the client is not configured', async () => {
    clients.findActiveBySlug.mockResolvedValue(null as never);

    await expect(
      controller.submit('swift-transport', 'platform-engineer', {
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects submit when the workspace is not active', async () => {
    clients.findActiveBySlug.mockResolvedValue({
      notionDbRolesId: 'roles-db',
      paymentStatus: PaymentStatus.PENDING,
    } as never);

    await expect(
      controller.submit('swift-transport', 'platform-engineer', {
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toThrow(
      'This workspace is not active yet. Complete payment to accept applications.',
    );
  });
});
