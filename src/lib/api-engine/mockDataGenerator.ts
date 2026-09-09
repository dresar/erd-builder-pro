export interface ColumnDefinition {
  name: string;
  type: string;
  is_pk?: boolean;
  is_nullable?: boolean;
  is_unique?: boolean;
  default_value?: string;
  enum_values?: string[];
  comment?: string;
}

export function generateRealisticValue(col: ColumnDefinition, tableName: string): any {
  const colName = col.name.toLowerCase();
  const type = (col.type || 'varchar').toLowerCase();

  if (col.is_pk || colName === 'id' || colName.endsWith('_id')) {
    if (type.includes('uuid')) {
      return '550e8400-e29b-41d4-a716-446655440000';
    }
    return 101;
  }

  if (col.enum_values && col.enum_values.length > 0) {
    return col.enum_values[0];
  }

  if (type.includes('bool')) {
    return true;
  }

  if (type.includes('int') || type.includes('serial')) {
    if (colName.includes('year')) return 2026;
    if (colName.includes('point') || colName.includes('score')) return 85;
    if (colName.includes('capacity') || colName.includes('limit')) return 50;
    if (colName.includes('order')) return 1;
    return 10;
  }

  if (type.includes('decimal') || type.includes('numeric') || type.includes('float') || type.includes('money')) {
    if (colName.includes('fee') || colName.includes('amount') || colName.includes('balance') || colName.includes('price')) {
      return 1500000;
    }
    return 89.5;
  }

  if (type.includes('date') && !type.includes('timestamp')) {
    return '2026-09-09';
  }

  if (type.includes('timestamp') || type.includes('time')) {
    return '2026-09-09T08:00:00.000Z';
  }

  if (type.includes('json')) {
    return { enabled: true, theme: 'dark', version: '1.0' };
  }

  if (colName.includes('email')) return 'santri.utama@pesantren.ac.id';
  if (colName.includes('phone') || colName.includes('wa') || colName.includes('telp')) return '081234567890';
  if (colName.includes('nik')) return '3201012304950001';
  if (colName.includes('nisn')) return '0054892147';
  if (colName.includes('nis')) return '20261001';
  if (colName.includes('name') || colName.includes('nama')) {
    if (colName.includes('user') || colName.includes('full')) return 'Ahmad Faris Al-Hafidz';
    if (tableName.includes('campus')) return 'Kampus Pusat Al-Hikmah';
    return 'Contoh Entitas';
  }
  if (colName.includes('title') || colName.includes('judul')) return 'Pendaftaran Santri Baru Gelombang 1';
  if (colName.includes('code') || colName.includes('kode')) return 'PSB-2026-001';
  if (colName.includes('slug')) return 'profil-lembaga-2026';
  if (colName.includes('address') || colName.includes('alamat')) return 'Jl. Pesantren No. 12, Jawa Timur';
  if (colName.includes('gender')) return 'male';
  if (colName.includes('status')) return 'active';
  if (colName.includes('password')) return '$2a$12$e8xL4sLqK9h.g7fK...hashed';
  if (colName.includes('url') || colName.includes('photo') || colName.includes('image')) return 'https://assets.pesantren.ac.id/images/sample.jpg';
  if (colName.includes('va_number') || colName.includes('va')) return '9881234500001234';

  return 'Nilai Contoh';
}

export function generateCreateMockPayload(columns: ColumnDefinition[], tableName: string): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const col of columns) {
    if (col.is_pk && !col.type.toLowerCase().includes('uuid')) continue;
    if (col.name === 'created_at' || col.name === 'updated_at' || col.name === 'deleted_at') continue;
    payload[col.name] = generateRealisticValue(col, tableName);
  }
  return payload;
}

export function generateUpdateMockPayload(columns: ColumnDefinition[], tableName: string): Record<string, any> {
  const payload: Record<string, any> = {};
  const editable = columns.filter(c => !c.is_pk && !['created_at', 'deleted_at'].includes(c.name));
  for (const col of editable.slice(0, 4)) {
    payload[col.name] = generateRealisticValue(col, tableName);
  }
  return payload;
}
