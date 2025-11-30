CREATE DATABASE quiz_db;
USE quiz_db;

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CHAR(1) NOT NULL
);

CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  score INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('Ibu kota Indonesia adalah...', 'Bandung', 'Surabaya', 'Jakarta', 'Medan', 'C'),
('Gunung tertinggi di Indonesia adalah...', 'Kerinci', 'Rinjani', 'Jayawijaya', 'Bromo', 'C'),
('Planet terdekat dengan matahari adalah...', 'Bumi', 'Mars', 'Venus', 'Merkurius', 'D'),
('Lambang sila pertama Pancasila adalah...', 'Bintang', 'Rantai', 'Pohon Beringin', 'Kepala Banteng', 'A'),
('Warna primer berikut yang benar adalah...', 'Merah, Kuning, Biru', 'Hijau, Ungu, Merah', 'Putih, Hitam, Abu', 'Coklat, Kuning, Biru', 'A');
