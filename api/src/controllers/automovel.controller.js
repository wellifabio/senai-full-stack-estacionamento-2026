const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const item = await prisma.automovel.create({
        data: req.body
    });

    return res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.automovel.findMany();
    return res.json(lista);
};

const buscar = async (req, res) => {
    const { placa } = req.params;

    const item = await prisma.automovel.findUnique({
        where: { placa },
        include: { estadias: true }
    });

    if (!item) {
        return res.status(404).json({ erro: "Automóvel não encontrado" });
    }

    return res.json(item);
};

const atualizar = async (req, res) => {
    const { placa } = req.params;

    try {
        const existe = await prisma.automovel.findUnique({
            where: { placa }
        });

        if (!existe) {
            return res.status(404).json({ erro: "Automóvel não encontrado" });
        }

        const item = await prisma.automovel.update({
            where: { placa },
            data: req.body
        });

        return res.json(item);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar automóvel" });
    }
};

const excluir = async (req, res) => {
    const { placa } = req.params;

    try {
        const existe = await prisma.automovel.findUnique({
            where: { placa }
        });

        if (!existe) {
            return res.status(404).json({ erro: "Automóvel não encontrado" });
        }

        const item = await prisma.automovel.delete({
            where: { placa }
        });

        return res.json(item);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao excluir automóvel" });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};