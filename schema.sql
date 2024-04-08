-- 既存のテーブルを削除
DROP TABLE IF EXISTS ExpenseParticipants;

DROP TABLE IF EXISTS Expenses;

DROP TABLE IF EXISTS GroupMembers;

DROP TABLE IF EXISTS Groups;

-- グループテーブルの作成
CREATE TABLE IF NOT EXISTS Groups (
  group_id INTEGER PRIMARY KEY,
  group_uuid TEXT UNIQUE,
  group_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- グループメンバーテーブルの作成
CREATE TABLE IF NOT EXISTS GroupMembers (
  member_id INTEGER PRIMARY KEY,
  group_id INTEGER,
  member_name TEXT,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  UNIQUE (group_id, member_name)
);

-- 支出テーブルの作成
CREATE TABLE IF NOT EXISTS Expenses (
  expense_id INTEGER PRIMARY KEY,
  group_id INTEGER,
  paid_by_member_id INTEGER,
  amount DECIMAL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES Groups(group_id),
  FOREIGN KEY (paid_by_member_id) REFERENCES GroupMembers(member_id)
);

-- 支出参加者テーブルの作成
CREATE TABLE IF NOT EXISTS ExpenseParticipants (
  expense_id INTEGER,
  member_id INTEGER,
  FOREIGN KEY (expense_id) REFERENCES Expenses(expense_id),
  FOREIGN KEY (member_id) REFERENCES GroupMembers(member_id)
);

-- グループの初期データ
INSERT INTO
  Groups (group_id, group_uuid, group_name)
VALUES
  (
    1,
    '123e4567-e89b-12d3-a456-426614174000',
    '旅行'
  );

-- グループメンバーの初期データ
INSERT INTO
  GroupMembers (member_id, group_id, member_name)
VALUES
  (1, 1, '太郎'),
  (2, 1, '花子'),
  (3, 1, '次郎');

-- 支出の初期データ
INSERT INTO
  Expenses (
    expense_id,
    group_id,
    paid_by_member_id,
    amount,
    description
  )
VALUES
  (1, 1, 1, 6000, 'レンタカー'),
  (2, 1, 2, 3000, 'ガソリン'),
  (3, 1, 3, 1000, 'ランチ');

-- 支出参加者の初期データ
INSERT INTO
  ExpenseParticipants (expense_id, member_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 2),
  (2, 3),
  (3, 1),
  (3, 2),
  (3, 3);