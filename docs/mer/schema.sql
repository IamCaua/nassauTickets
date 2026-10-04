-- nassauTickets: esquema MySQL 8.0
CREATE DATABASE IF NOT EXISTS nassautickets CHARACTER SET utf8mb4;
USE nassautickets;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil ENUM('ATENDENTE','GESTOR') NOT NULL DEFAULT 'ATENDENTE',
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE guiche (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tipo_senha (
  sigla CHAR(2) PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL,
  prioridade INT NOT NULL
);
INSERT INTO tipo_senha VALUES ('SP','Senha Prioritária',1),('SE','Senha para Retirada de Exames',2),('SG','Senha Geral',3);

CREATE TABLE senha (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(12) NOT NULL UNIQUE,            -- YYMMDD-PPSQ
  tipo CHAR(2) NOT NULL,
  sequencia INT NOT NULL,
  data_emissao DATE NOT NULL,
  emitida_em DATETIME NOT NULL,
  estado ENUM('EMITIDA','AGUARDANDO','CHAMADA','CHAMADA_NOVAMENTE','EM_ATENDIMENTO','ATENDIDA','NAO_COMPARECEU') NOT NULL,
  descartada BOOLEAN NOT NULL DEFAULT FALSE,
  inicio_atendimento DATETIME NULL,
  fim_atendimento DATETIME NULL,
  guiche_id INT NULL,
  usuario_id INT NULL,
  UNIQUE (data_emissao, tipo, sequencia),         -- sequência reinicia por dia
  FOREIGN KEY (tipo) REFERENCES tipo_senha(sigla),
  FOREIGN KEY (guiche_id) REFERENCES guiche(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE chamada (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senha_id INT NOT NULL,
  guiche_id INT NOT NULL,
  usuario_id INT NOT NULL,
  ordem TINYINT NOT NULL,                         -- 1 = primeira, 2 = última chamada
  chamada_em DATETIME NOT NULL,
  FOREIGN KEY (senha_id) REFERENCES senha(id),
  FOREIGN KEY (guiche_id) REFERENCES guiche(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE historico_estado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senha_id INT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  em DATETIME NOT NULL,
  FOREIGN KEY (senha_id) REFERENCES senha(id)
);

-- Concorrência: a escolha da próxima senha roda dentro de uma transação:
--   START TRANSACTION;
--   SELECT id FROM senha WHERE estado='AGUARDANDO' AND tipo=? AND descartada=FALSE
--     ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;
--   UPDATE senha SET estado='CHAMADA', guiche_id=?, usuario_id=? WHERE id=?;
--   COMMIT;
