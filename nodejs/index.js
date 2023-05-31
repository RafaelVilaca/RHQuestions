const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
const cors = require('cors');
const app = express();
const PORT = 3333;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.use(express.json());

// Permite acesso de qualquer origem
app.use(cors());

// Permite acesso de apenas algumas origens específicas
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080']
}));

app.put('/usuario/login', async (req, res) => {
  try {
    const { login,senha } = req.body;
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE login = ? AND senha = ?', [login,senha]);
    res.json(rows.length > 0 ? rows[0] : null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT us.*, em.nome AS empresa FROM usuarios us LEFT JOIN empresas em ON us.codigo_empresa = em.codigo');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

app.post('/usuario', async (req, res) => {
  const { ativo,admin_system,login,senha,nome,email,codigo_empresa } = req.body;

  try {
    if (nome.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + nome.length });
      return;
    } else if (email.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + email.length });
      return;
    } else if (login.length > 50) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + login.length });
      return;
    } else if (senha.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + senha.length });
      return;
    } else if (!codigo_empresa || codigo_empresa == 0) {
      res.json({ message: "Empresa é obrigatória" });
      return; 
    } else {
      const [result] = await pool.query('INSERT INTO usuarios (ativo,admin_system,login,senha,nome,email,codigo_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)', [ativo,admin_system,login,senha,nome,email,codigo_empresa]);
      res.json({ id: result.insertId, ativo, admin_system, login, nome, email, codigo_empresa });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
});

app.get('/usuario/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});
  
app.put('/usuario/:id', async (req, res) => {
  const codigo = req.params.id;
  const { ativo,admin_system,login,senha,nome,email,codigo_empresa } = req.body;
  try {
    if (nome.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + nome.length });
      return;
    } else if (email.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + email.length });
      return;
    } else if (login.length > 50) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + login.length });
      return;
    } else if (senha.length > 100) {
      res.json({ message: "Nome do usuário ultrapassou 100 caracteres, está com " + senha.length });
      return;
    } else if (!codigo_empresa || codigo_empresa == 0) {
      res.json({ message: "Empresa é obrigatória" });
      return; 
    } else {
      const [result] = await pool.query('UPDATE usuarios SET ativo=?,admin_system=?,login=?,nome=?,email=?,codigo_empresa=? WHERE codigo = ' + codigo, [ativo,admin_system,login,nome,email,codigo_empresa]);
      res.json({ id: result.insertId, ativo, admin_system, login, nome, email, codigo_empresa });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
});

app.delete('/usuario/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    await pool.query('DELETE FROM respostas WHERE codigo_usuario = ' + codigo)
    const [rows] = await pool.query('DELETE FROM usuarios WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao deletar usuário do id = ' + codigo });
  }
});

app.get('/empresas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empresas');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar empresas.' });
  }
});

app.get('/empresas/ativas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empresas WHERE ativo = 1 ORDER BY nome');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar empresas.' });
  }
});

app.post('/empresa', async (req, res) => {
  const { ativo,nome,cnpj } = req.body;
  try {
    if (nome.length > 100) {
      res.json({ message: "Nome da empresa ultrapassou 100 caracteres, está com " + nome.length });
      return;
    } else {
      const [result] = await pool.query('INSERT INTO empresas (ativo,nome,cnpj) VALUES (?, ?, ?)', [ativo,nome,cnpj]);
      res.json({ id: result.insertId, ativo, nome, cnpj });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar empresa.' });
  }
});

app.get('/empresa/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM empresas WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar empresa.' });
  }
});
  
app.put('/empresa/:id', async (req, res) => {
  const codigo = req.params.id;
  const { ativo,nome,cnpj } = req.body;
  try {
    if (nome.length > 100) {
      res.json({ message: "Nome da empresa ultrapassou 100 caracteres, está com " + nome.length });
      return;
    } else {
      const [result] = await pool.query('UPDATE empresas SET ativo=?,nome=?,cnpj=? WHERE codigo = ' + codigo, [ativo,nome,cnpj]);
      res.json({ id: result.insertId, ativo, nome, cnpj });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar empresa.' });
  }
});

app.delete('/empresa/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    await pool.query(`DELETE FROM respostas WHERE codigo_usuario IN (SELECT codigo FROM usuarios WHERE codigo_empresa = ${codigo})`);
    await pool.query(`DELETE FROM perguntas WHERE codigo_acao IN (SELECT codigo FROM acao WHERE codigo_empresa = ${codigo})`);
    await pool.query(`DELETE FROM acao WHERE codigo_empresa = ${codigo}`);
    await pool.query('DELETE FROM usuarios WHERE codigo_empresa = ' + codigo);
    const [rows] = await pool.query('DELETE FROM empresas WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao deletar empresa do id = ' + codigo });
  }
});

app.get('/acao', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT ac.*, em.nome AS empresa FROM acao ac LEFT JOIN empresas em ON ac.codigo_empresa = em.codigo');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar acao.' });
  }
});

app.post('/acao', async (req, res) => {
  const { ativo,title,descricao,prazo_inicial,prazo_final,codigo_empresa } = req.body;
  try {
    if (title.length > 100) {
      res.json({ message: "Título ultrapassou 100 caracteres, está com " + title.length });
      return;
    } else if (descricao.length > 300) {
      res.json({ message: "A descrição ultrapassou 300 caracteres, está com " + descricao.length });
      return;
    } else if (!codigo_empresa || codigo_empresa == 0) {
      res.json({ message: "Empresa é obrigatória" });
      return;
    } else {
      const [result] = await pool.query('INSERT INTO acao (ativo,title,descricao,prazo_inicial,prazo_final,codigo_empresa) VALUES (?,?,?,DATE(?),DATE(?),?)', [ativo, title, descricao, prazo_inicial, prazo_final, codigo_empresa]);
      res.json({ id: result.insertId, ativo, title, descricao, prazo_inicial, prazo_final, codigo_empresa });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar acao.' });
  }
});

app.get('/acao/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM acao WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar acao.' });
  }
});

const DateFormat = (e) => {
  let data = new Date(e);
  return data.getFullYear() + "-" + ((data.getMonth() + 1 < 10) ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1)) + "-" + ((data.getDate() < 10) ? '0' + (data.getDate()) : (data.getDate()));
}
  
app.put('/acao/:id', async (req, res) => {
  const codigo = req.params.id;
  const { ativo,title,descricao,prazo_inicial,prazo_final,codigo_empresa } = req.body;
  try {
    if (title.length > 100) {
      res.json({ message: "Título ultrapassou 100 caracteres, está com " + title.length });
      return;
    } else if (descricao.length > 300) {
      res.json({ message: "A descrição ultrapassou 300 caracteres, está com " + descricao.length });
      return;
    } else if (!codigo_empresa || codigo_empresa == 0) {
      res.json({ message: "Empresa é obrigatória" });
      return;
    } else {
      const [result] = await pool.query('UPDATE acao SET ativo=?,title=?,descricao=?,prazo_inicial=DATE(?),prazo_final=DATE(?),codigo_empresa=? WHERE codigo = ' + codigo, [ativo,title,descricao,DateFormat(prazo_inicial),DateFormat(prazo_final),codigo_empresa]);
      res.json({ id: result.insertId, ativo, title, descricao, prazo_inicial, prazo_final, codigo_empresa });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar acao.' });
  }
});

app.delete('/acao/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows_pergunta] = await pool.query('SELECT codigo FROM perguntas WHERE codigo_acao = ' + codigo);
    let codigos_perguntas = [];
    rows_pergunta.forEach(x => codigos_perguntas.push(x.codigo))
    await pool.query(`DELETE FROM respostas WHERE codigo_pergunta  IN (SELECT codigo FROM perguntas WHERE codigo_acao = ${codigo})`);
    await pool.query('DELETE FROM perguntas WHERE codigo_acao = ' + codigo);
    const [rows] = await pool.query('DELETE FROM acao WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao deletar acao do id = ' + codigo });
  }
});

app.get('/perguntas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT pe.*, ac.title AS acao FROM perguntas pe LEFT JOIN acao ac ON pe.codigo_acao = ac.codigo');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar perguntas.' });
  }
});

app.post('/pergunta', async (req, res) => {
  const { ativo,descricao,codigo_acao } = req.body;
  try {
    if (descricao.length > 300) {
      res.json({ message: "A pergunta ultrapassou 300 caracteres, está com " + descricao.length });
      return;
    } else if (!codigo_acao || codigo_acao == 0) {
      res.json({ message: "Ação é obrigatória" });
      return;
    } else {
      const [result] = await pool.query('INSERT INTO perguntas (ativo,descricao,codigo_acao) VALUES (?, ?, ?)', [ativo,descricao,codigo_acao]);
      res.json({ id: result.insertId, ativo, descricao, codigo_acao });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar pergunta.' });
  }
});

app.get('/pergunta/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM perguntas WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar pergunta.' });
  }
});
  
app.put('/pergunta/:id', async (req, res) => {
  const codigo = req.params.id;
  const { ativo,descricao,codigo_acao } = req.body;
  try {
    if (descricao.length > 300) {
      res.json({ message: "A pergunta ultrapassou 300 caracteres, está com " + descricao.length });
      return;
    } else if (!codigo_acao || codigo_acao == 0) {
      res.json({ message: "Ação é obrigatória" });
      return;
    } else {
      const [result] = await pool.query('UPDATE perguntas SET ativo=?,descricao=?,codigo_acao=? WHERE codigo = ' + codigo, [ativo,descricao,codigo_acao]);
      res.json({ id: result.insertId, ativo, descricao, codigo_acao });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar pergunta.' });
  }
});

app.delete('/pergunta/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    await pool.query('DELETE FROM respostas WHERE codigo_pergunta = ' + codigo);
    const [rows] = await pool.query('DELETE FROM perguntas WHERE codigo = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao deletar pergunta do id = ' + codigo });
  }
});

app.get('/respostas/:id', async (req, res) => {
  try {
    const codigo_acao = req.params.id;
    const [rows_pergunta] = await pool.query('SELECT codigo FROM perguntas WHERE codigo_acao = ' + codigo_acao);
    let codigos_perguntas = [];
    rows_pergunta.forEach(x => codigos_perguntas.push(x.codigo))
    const [rows] = await pool.query('SELECT * FROM respostas WHERE codigo_pergunta IN (' + codigos_perguntas + ')');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar acao.' });
  }
});

app.post('/respostas', async (req, res) => {
  const { codigo_pergunta,resposta,codigo_usuario } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO respostas (codigo_pergunta,resposta,codigo_usuario) VALUES (?, ?, ?)', [codigo_pergunta,resposta,codigo_usuario]);
    res.json({ id: result.insertId, codigo_pergunta, resposta });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar acao.' });
  }
});

app.put('/usuario/desativarAtivar/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const ativo = await pool.query('SELECT ativo FROM usuarios WHERE codigo = ' + codigo + ' LIMIT 1');
    let row = 0;
    ativo[0].forEach(x => x.ativo == 0 ? row = 1 : row = 0);
    const [result] = await pool.query('UPDATE usuarios SET ativo = ' + row + ' WHERE codigo = ' + codigo);
    res.json({ id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar pergunta.' });
  }
});

app.put('/empresa/desativarAtivar/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const ativo = await pool.query('SELECT ativo FROM empresas WHERE codigo = ' + codigo + ' LIMIT 1');
    let row = 0;
    ativo[0].forEach(x => x.ativo == 0 ? row = 1 : row = 0);
    const [result] = await pool.query('UPDATE empresas SET ativo = ' + row + ' WHERE codigo = ' + codigo);
    res.json({ id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar pergunta.' });
  }
});

app.put('/acao/desativarAtivar/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const ativo = await pool.query('SELECT ativo FROM acao WHERE codigo = ' + codigo + ' LIMIT 1');
    let row = 0;
    ativo[0].forEach(x => x.ativo == 0 ? row = 1 : row = 0);
    const [result] = await pool.query('UPDATE acao SET ativo = ' + row + ' WHERE codigo = ' + codigo);
    res.json({ id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar pergunta.' });
  }
});

app.get('/see-all-employees-of-company/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE codigo_empresa = ' + codigo);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});

app.put('/pergunta/desativarAtivar/:id', async (req, res) => {
  const codigo = req.params.id;
  try {
    const ativo = await pool.query('SELECT ativo FROM perguntas WHERE codigo = ' + codigo + ' LIMIT 1');
    let row = 0;
    ativo[0].forEach(x => x.ativo == 0 ? row = 1 : row = 0);
    const [result] = await pool.query('UPDATE perguntas SET ativo = ' + row + ' WHERE codigo = ' + codigo);
    res.json({ id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao atualizar pergunta.' });
  }
});

app.get('/acoes/ativas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM acao WHERE ativo = 1 ORDER BY title');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar ações.' });
  }
});

app.get('/acoes/vigentes/:id', async (req, res) => {
  const codigo_usuario = req.params.id;
  try {
    const [rows] = await pool.query(`SELECT ac.* FROM acao ac
                                      INNER JOIN empresas em
                                        ON ac.codigo_empresa = em.codigo
                                      INNER JOIN usuarios us
                                        ON em.codigo = us.codigo_empresa
                                      WHERE us.codigo = ${codigo_usuario}
                                        AND CURDATE() BETWEEN ac.prazo_inicial AND ac.prazo_final
                                            AND ac.ativo = 1
                                            AND em.ativo = 1;`);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar pergunta.' });
  }
});

app.get('/allQuestions/:id', async (req, res) => {
  const codigo_acao = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM perguntas WHERE codigo_acao = ' + codigo_acao);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar ações.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
