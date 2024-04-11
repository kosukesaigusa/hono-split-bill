DROP TABLE IF EXISTS ExpenseParticipants;

DROP TABLE IF EXISTS Expenses;

DROP TABLE IF EXISTS Members;

DROP TABLE IF EXISTS Groups;

CREATE TABLE IF NOT EXISTS Groups (
  group_uuid TEXT PRIMARY KEY,
  group_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Members (
  member_uuid TEXT PRIMARY KEY,
  member_name TEXT,
  group_uuid TEXT,
  FOREIGN KEY (group_uuid) REFERENCES Groups(group_uuid),
  UNIQUE (group_uuid, member_name)
);

CREATE TABLE IF NOT EXISTS Expenses (
  expense_uuid TEXT PRIMARY KEY,
  description TEXT,
  amount DECIMAL,
  group_uuid TEXT,
  paid_by_member_uuid TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_uuid) REFERENCES Groups(group_uuid),
  FOREIGN KEY (paid_by_member_uuid) REFERENCES Members(member_uuid)
);

CREATE TABLE IF NOT EXISTS ExpenseParticipants (
  expense_uuid TEXT,
  member_uuid TEXT,
  FOREIGN KEY (expense_uuid) REFERENCES Expenses(expense_uuid),
  FOREIGN KEY (member_uuid) REFERENCES Members(member_uuid),
  UNIQUE (expense_uuid, member_uuid)
);

INSERT INTO
  Groups (group_uuid, group_name)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', '旅行');

INSERT INTO
  Members (member_uuid, group_uuid, member_name)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174000',
    '太郎'
  ),
  (
    '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
    '123e4567-e89b-12d3-a456-426614174000',
    '花子'
  ),
  (
    'c56a4180-65aa-42ec-a945-5fd21dec0538',
    '123e4567-e89b-12d3-a456-426614174000',
    '次郎'
  );

INSERT INTO
  Expenses (
    expense_uuid,
    group_uuid,
    paid_by_member_uuid,
    amount,
    description
  )
VALUES
  (
    '9f6419ff-8b86-d011-b42d-00cf4fc964aa',
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440000',
    6000,
    'レンタカー'
  ),
  (
    'a36419ff-8b86-d011-b42d-00cf4fc964bb',
    '123e4567-e89b-12d3-a456-426614174000',
    '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
    3000,
    'ガソリン'
  ),
  (
    'b76419ff-8b86-d011-b42d-00cf4fc964cc',
    '123e4567-e89b-12d3-a456-426614174000',
    'c56a4180-65aa-42ec-a945-5fd21dec0538',
    1000,
    'ランチ'
  );

INSERT INTO
  ExpenseParticipants (expense_uuid, member_uuid)
VALUES
  (
    '9f6419ff-8b86-d011-b42d-00cf4fc964aa',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    '9f6419ff-8b86-d011-b42d-00cf4fc964aa',
    '6f9619ff-8b86-d011-b42d-00cf4fc964ff'
  ),
  (
    '9f6419ff-8b86-d011-b42d-00cf4fc964aa',
    'c56a4180-65aa-42ec-a945-5fd21dec0538'
  ),
  (
    'a36419ff-8b86-d011-b42d-00cf4fc964bb',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    'a36419ff-8b86-d011-b42d-00cf4fc964bb',
    '6f9619ff-8b86-d011-b42d-00cf4fc964ff'
  ),
  (
    'a36419ff-8b86-d011-b42d-00cf4fc964bb',
    'c56a4180-65aa-42ec-a945-5fd21dec0538'
  ),
  (
    'b76419ff-8b86-d011-b42d-00cf4fc964cc',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    'b76419ff-8b86-d011-b42d-00cf4fc964cc',
    '6f9619ff-8b86-d011-b42d-00cf4fc964ff'
  ),
  (
    'b76419ff-8b86-d011-b42d-00cf4fc964cc',
    'c56a4180-65aa-42ec-a945-5fd21dec0538'
  );