const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const item = await prisma.estadia.create({
        data: req.body
    });

    return res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.estadia.findMany();
    return res.json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    return res.json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const estadia = await prisma.estadia.findUnique({
        where: { id: Number(id) }
    });

    if (!estadia) {
        return res.status(404).json({ error: "Estadia não encontrada!" });
    }

    let dados = req.body;

    if (dados.saida) {
        const entrada = new Date(estadia.entrada);
        const saida = new Date(dados.saida);

        const horas = (saida - entrada) / (1000 * 60 * 60);

        dados.valorTotal = horas * estadia.valorHora;
    }

    const item = await prisma.estadia.update({
        where: { id: Number(id) },
        data: dados
    });

    return res.json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.estadia.delete({
        where: { id: Number(id) }
    });

    return res.json(item);
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};