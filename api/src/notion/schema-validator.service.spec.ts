import { SchemaValidatorService } from './schema-validator.service';

describe('SchemaValidatorService', () => {
  const svc = new SchemaValidatorService();

  it('returns valid for matching schemas', () => {
    const mk = (props: Record<string, { type: string }>) => ({ properties: props });
    const res = svc.validate({
      candidates: mk({
        Name: { type: 'title' },
        Email: { type: 'email' },
        Phone: { type: 'phone_number' },
        'CV URL': { type: 'url' },
        Role: { type: 'relation' },
        Stage: { type: 'relation' },
      }),
      roles: mk({
        'Role Name': { type: 'title' },
        Status: { type: 'select' },
        'Public Slug': { type: 'rich_text' },
      }),
      stages: mk({
        'Stage Name': { type: 'title' },
        Order: { type: 'number' },
        'Is Terminal': { type: 'checkbox' },
      }),
    });

    expect(res.valid).toBe(true);
    expect(res.missing).toHaveLength(0);
  });

  it('returns actionable fixes for missing fields', () => {
    const res = svc.validate({ candidates: { properties: {} }, roles: { properties: {} }, stages: { properties: {} } });
    expect(res.valid).toBe(false);
    expect(res.fixes.length).toBeGreaterThan(0);
  });
});
