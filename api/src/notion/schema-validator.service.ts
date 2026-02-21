import { Injectable } from '@nestjs/common';

type Missing = { database: 'candidates' | 'roles' | 'stages'; property: string; recommendedType: string };

@Injectable()
export class SchemaValidatorService {
  validate(payload: { candidates: any; roles: any; stages: any }) {
    const missing: Missing[] = [];

    const mustHave = (
      db: 'candidates' | 'roles' | 'stages',
      props: Record<string, any>,
      name: string,
      allowedTypes: string[],
      recommendedType: string,
    ) => {
      const prop = props?.[name];
      const type = prop?.type;
      if (!prop || !allowedTypes.includes(type)) {
        missing.push({ database: db, property: name, recommendedType });
      }
    };

    const cProps = payload.candidates?.properties || {};
    mustHave('candidates', cProps, 'Name', ['title'], 'title');
    mustHave('candidates', cProps, 'Email', ['email', 'rich_text'], 'email');
    mustHave('candidates', cProps, 'Phone', ['phone_number', 'rich_text'], 'phone_number');
    mustHave('candidates', cProps, 'CV URL', ['url', 'rich_text'], 'url');
    mustHave('candidates', cProps, 'Role', ['relation'], 'relation');
    mustHave('candidates', cProps, 'Stage', ['relation'], 'relation');

    const rProps = payload.roles?.properties || {};
    mustHave('roles', rProps, 'Role Name', ['title'], 'title');
    mustHave('roles', rProps, 'Status', ['select'], 'select');
    mustHave('roles', rProps, 'Public Slug', ['rich_text'], 'rich_text');

    const sProps = payload.stages?.properties || {};
    mustHave('stages', sProps, 'Stage Name', ['title'], 'title');
    mustHave('stages', sProps, 'Order', ['number'], 'number');
    mustHave('stages', sProps, 'Is Terminal', ['checkbox'], 'checkbox');

    return {
      valid: missing.length === 0,
      missing,
      fixes: missing.map((m) => `In ${m.database} DB, add property \"${m.property}\" as type ${m.recommendedType}.`),
    };
  }
}
