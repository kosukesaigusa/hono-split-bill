-- Drop existing tables
DROP TABLE IF EXISTS ExpenseParticipants;

DROP TABLE IF EXISTS Expenses;

DROP TABLE IF EXISTS GroupMembers;

DROP TABLE IF EXISTS Groups;

-- Create groups table
CREATE TABLE IF NOT EXISTS Groups (
  group_id INTEGER PRIMARY KEY,
  group_uuid TEXT UNIQUE,
  group_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create group members table
CREATE TABLE IF NOT EXISTS GroupMembers (
  member_id INTEGER PRIMARY KEY,
  group_id INTEGER,
  member_name TEXT,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  UNIQUE (group_id, member_name)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS Expenses (
  expense_id INTEGER PRIMARY KEY,
  group_id INTEGER,
  paid_by_member_id INTEGER,
  amount DECIMAL,
  description TEXT,
  participant_member_ids TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  FOREIGN KEY (paid_by_member_id) REFERENCES GroupMembers(member_id)
);

-- Insert group data
INSERT INTO
  Groups (group_id, group_uuid, group_name)
VALUES
  (1, '123e4567-e89b-12d3-a456-426614174000', '旅行');

-- Insert group members data
INSERT INTO
  GroupMembers (member_id, group_id, member_name)
VALUES
  (1, 1, '太郎'),
  (2, 1, '花子'),
  (3, 1, '次郎');

-- Insert expenses data
INSERT INTO
  Expenses (
    expense_id,
    group_id,
    paid_by_member_id,
    amount,
    description,
    participant_member_ids
  )
VALUES
  (1, 1, 1, 6000, 'レンタカー', '1,2,3'),
  (2, 1, 2, 3000, 'ガソリン', '1,2,3'),
  (3, 1, 3, 1000, 'ランチ', '1,2,3');