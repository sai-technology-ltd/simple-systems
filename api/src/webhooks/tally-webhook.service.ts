import { BadRequestException, Injectable } from '@nestjs/common';
import { HiringIntakeDto } from './dto/hiring-intake.dto';

type TallyField = {
  key?: string;
  label?: string;
  type?: string;
  value?: unknown;
};

type TallyPayload = {
  eventType?: string;
  type?: string;
  data?: {
    responseId?: string;
    submissionId?: string;
    fields?: TallyField[];
    hiddenFields?: Record<string, unknown>;
  };
  fields?: TallyField[];
  hiddenFields?: Record<string, unknown>;
};

@Injectable()
export class TallyWebhookService {
  toHiringIntakeDto(payload: TallyPayload): HiringIntakeDto {
    const eventType = payload.eventType ?? payload.type;
    if (eventType && eventType !== 'FORM_RESPONSE') {
      throw new BadRequestException('Unsupported Tally event type');
    }

    const fields = payload.data?.fields ?? payload.fields ?? [];
    const hiddenFields = {
      ...(payload.hiddenFields ?? {}),
      ...(payload.data?.hiddenFields ?? {}),
    };

    const roleId =
      this.readHidden(hiddenFields, ['roleId', 'role_id']) ??
      this.findFieldValue(fields, ['roleId', 'role id', 'role']);
    const candidateName = this.findFieldValue(fields, [
      'candidateName',
      'candidate name',
      'full name',
      'name',
    ]);
    const candidateEmail = this.findFieldValue(fields, [
      'candidateEmail',
      'candidate email',
      'email',
      'email address',
    ]);
    const phone = this.findFieldValue(fields, [
      'phone',
      'phone number',
      'candidate phone',
    ]);
    const cvUrl = this.findFieldValue(fields, [
      'cv url',
      'cv',
      'resume url',
      'resume',
      'portfolio url',
    ]);
    const notes = this.findFieldValue(fields, [
      'notes',
      'additional notes',
      'cover letter',
      'message',
    ]);
    const submissionId =
      this.readString(payload.data?.responseId) ??
      this.readString(payload.data?.submissionId);

    if (!roleId) {
      throw new BadRequestException('Tally payload missing roleId');
    }

    if (!candidateName) {
      throw new BadRequestException('Tally payload missing candidate name');
    }

    if (!candidateEmail) {
      throw new BadRequestException('Tally payload missing candidate email');
    }

    return {
      roleId,
      candidateName,
      candidateEmail,
      phone: phone ?? undefined,
      cvUrl: cvUrl ?? undefined,
      notes: notes ?? undefined,
      submissionId: submissionId ?? undefined,
    };
  }

  private readHidden(
    hiddenFields: Record<string, unknown>,
    aliases: string[],
  ): string | null {
    const normalizedAliases = aliases.map((alias) => this.normalize(alias));

    for (const [key, value] of Object.entries(hiddenFields)) {
      if (normalizedAliases.includes(this.normalize(key))) {
        return this.readString(value);
      }
    }

    return null;
  }

  private findFieldValue(fields: TallyField[], aliases: string[]): string | null {
    const normalizedAliases = aliases.map((alias) => this.normalize(alias));

    for (const field of fields) {
      const candidates = [field.key, field.label, field.type].filter(Boolean);
      if (
        candidates.some((candidate) =>
          normalizedAliases.includes(this.normalize(candidate!)),
        )
      ) {
        const value = this.readString(field.value);
        if (value) return value;
      }
    }

    return null;
  }

  private readString(value: unknown): string | null {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      const items = value
        .map((item) => this.readString(item))
        .filter((item): item is string => Boolean(item));
      return items[0] ?? null;
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      return (
        this.readString(record.url) ??
        this.readString(record.value) ??
        this.readString(record.name) ??
        null
      );
    }

    return null;
  }

  private normalize(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}
