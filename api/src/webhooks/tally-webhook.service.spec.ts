import { BadRequestException } from '@nestjs/common';
import { TallyWebhookService } from './tally-webhook.service';

describe('TallyWebhookService', () => {
  let service: TallyWebhookService;

  beforeEach(() => {
    service = new TallyWebhookService();
  });

  it('maps a Tally form response into the internal intake payload', () => {
    expect(
      service.toHiringIntakeDto({
        eventType: 'FORM_RESPONSE',
        data: {
          responseId: 'resp_123',
          hiddenFields: {
            roleId: 'role-page-1',
          },
          fields: [
            { label: 'Full name', value: 'Jane Doe' },
            { label: 'Email', value: 'jane@example.com' },
            { label: 'Phone number', value: '+15550000000' },
            {
              label: 'Resume',
              value: [{ url: 'https://files.example.com/jane-cv.pdf' }],
            },
            { label: 'Cover letter', value: 'Built reliable internal tools.' },
          ],
        },
      }),
    ).toEqual({
      roleId: 'role-page-1',
      candidateName: 'Jane Doe',
      candidateEmail: 'jane@example.com',
      phone: '+15550000000',
      cvUrl: 'https://files.example.com/jane-cv.pdf',
      notes: 'Built reliable internal tools.',
      submissionId: 'resp_123',
    });
  });

  it('accepts key-based aliases when labels differ', () => {
    expect(
      service.toHiringIntakeDto({
        type: 'FORM_RESPONSE',
        hiddenFields: {
          role_id: 'role-page-2',
        },
        fields: [
          { key: 'candidateName', value: 'John Smith' },
          { key: 'candidateEmail', value: 'john@example.com' },
        ],
      }),
    ).toEqual({
      roleId: 'role-page-2',
      candidateName: 'John Smith',
      candidateEmail: 'john@example.com',
      phone: undefined,
      cvUrl: undefined,
      notes: undefined,
      submissionId: undefined,
    });
  });

  it('rejects payloads without required fields', () => {
    expect(() =>
      service.toHiringIntakeDto({
        eventType: 'FORM_RESPONSE',
        data: {
          fields: [{ label: 'Email', value: 'jane@example.com' }],
        },
      }),
    ).toThrow(BadRequestException);
  });
});
