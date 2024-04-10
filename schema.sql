-- Drop existing tables
DROP TABLE IF EXISTS ExpenseParticipants;

DROP TABLE IF EXISTS Expenses;

DROP TABLE IF EXISTS Members;

DROP TABLE IF EXISTS Groups;

-- Create groups table
CREATE TABLE IF NOT EXISTS Groups (
  group_id INTEGER PRIMARY KEY,
  group_uuid TEXT UNIQUE,
  group_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create members table
CREATE TABLE IF NOT EXISTS Members (
  member_id INTEGER PRIMARY KEY,
  member_uuid TEXT UNIQUE,
  group_id INTEGER,
  member_name TEXT,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  UNIQUE (group_id, member_name)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS Expenses (
  expense_id INTEGER PRIMARY KEY,
  expense_uuid TEXT UNIQUE,
  group_id INTEGER,
  paid_by_member_id INTEGER,
  description TEXT,
  amount DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  FOREIGN KEY (paid_by_member_id) REFERENCES Members(member_id)
);

-- Create expense participants table
CREATE TABLE IF NOT EXISTS ExpenseParticipants (
  expense_uuid TEXT,
  member_uuid TEXT,
  FOREIGN KEY (expense_uuid) REFERENCES Expenses(expense_uuid),
  FOREIGN KEY (member_uuid) REFERENCES Members(member_uuid),
  UNIQUE (expense_uuid, member_uuid)
);

-- Insert initial Group data
INSERT INTO
  Groups (group_uuid, group_name)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', '旅行');

-- Insert initial Members data
INSERT INTO
  Members (member_uuid, group_id, member_name)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 1, '太郎'),
  ('6f9619ff-8b86-d011-b42d-00cf4fc964ff', 1, '花子'),
  ('c56a4180-65aa-42ec-a945-5fd21dec0538', 1, '次郎');

-- Insert initial Expenses data
INSERT INTO
  Expenses (
    expense_uuid,
    group_id,
    paid_by_member_id,
    amount,
    description
  )
VALUES
  (
    '9f6419ff-8b86-d011-b42d-00cf4fc964aa',
    1,
    1,
    6000,
    'レンタカー'
  ),
  (
    'a36419ff-8b86-d011-b42d-00cf4fc964bb',
    1,
    2,
    3000,
    'ガソリン'
  ),
  (
    'b76419ff-8b86-d011-b42d-00cf4fc964cc',
    1,
    3,
    1000,
    'ランチ'
  );

-- Insert initial ExpenseParticipants data
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