import { ColumnType, Schema, Table } from '@powersync/web';

export const AppSchema = new Schema({
  assessments: new Table({
    created_at: ColumnType.TEXT,
    updated_at: ColumnType.TEXT,
    description: ColumnType.TEXT,
    status: ColumnType.TEXT,
    lead_id: ColumnType.TEXT,
    damage_score: ColumnType.INTEGER,
    // Add other fields as needed
  }),
  // Add other tables here (leads, customers, etc.)
  leads: new Table({
    created_at: ColumnType.TEXT,
    first_name: ColumnType.TEXT,
    last_name: ColumnType.TEXT,
    email: ColumnType.TEXT,
    status: ColumnType.TEXT,
    address: ColumnType.TEXT
  })
});

export type Database = (typeof AppSchema)['types'];
