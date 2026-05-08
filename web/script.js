const API_AUTO = "http://localhost:3000/automovel";
const API_EST = "http://localhost:3000/estadia";

const formAuto = document.getElementById("formAutomovel");
const listaAuto = document.getElementById("listaAutomoveis");

let placaSendoEditada = null;

formAuto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const automovel = {
        placa: document.getElementById("placa").value,
        proprietario: document.getElementById("proprietario").value,
        tipo: document.getElementById("tipo").value,
        modelo: document.getElementById("modelo").value,
        marca: document.getElementById("marca").value,
        cor: document.getElementById("cor").value || null,
        ano: document.getElementById("ano").value ? Number(document.getElementById("ano").value) : null,
        telefone: document.getElementById("telefone").value
    };

    let url = `${API_AUTO}/cadastrar`;
    let metodo = "POST";

    if (placaSendoEditada) {
        url = `${API_AUTO}/atualizar/${placaSendoEditada}`;
        metodo = "PUT";
    }

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automovel)
    });

    placaSendoEditada = null;
    formAuto.reset();
    listarAutomoveis();
});

async function listarAutomoveis() {
    const res = await fetch(`${API_AUTO}/listar`);
    const dados = await res.json();
    listaAuto.innerHTML = "";

    dados.forEach(item => {
        listaAuto.innerHTML += `
        <tr>
            <td>${item.placa}</td>
            <td>${item.proprietario}</td>
            <td>${item.modelo}</td>
            <td>
                <button onclick="prepararEdicaoAuto('${item.placa}','${item.proprietario}','${item.tipo}','${item.modelo}','${item.marca}','${item.cor || ''}','${item.ano || ''}','${item.telefone}')">Editar</button>
                <button onclick="excluirAuto('${item.placa}')">Excluir</button>
            </td>
        </tr>`;
    });
}

function prepararEdicaoAuto(placa, proprietario, tipo, modelo, marca, cor, ano, telefone) {
    placaSendoEditada = placa;
    document.getElementById("placa").value = placa;
    document.getElementById("proprietario").value = proprietario;
    document.getElementById("tipo").value = tipo;
    document.getElementById("modelo").value = modelo;
    document.getElementById("marca").value = marca;
    document.getElementById("cor").value = cor;
    document.getElementById("ano").value = ano;
    document.getElementById("telefone").value = telefone;
}

async function excluirAuto(placa) {
    if (confirm("Deseja excluir este veículo?")) {
        await fetch(`${API_AUTO}/excluir/${placa}`, { method: "DELETE" });
        listarAutomoveis();
    }
}

const formEst = document.getElementById("formEstadia");
const listaEst = document.getElementById("listaEstadias");

formEst.addEventListener("submit", async (e) => {
    e.preventDefault();

    const estadia = {
        placa: document.getElementById("placaEstadia").value,
        valorHora: Number(document.getElementById("valorHora").value)
    };

    if (window.estadiaEditando) {
        await fetch(`${API_EST}/atualizar/${window.estadiaEditando}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(estadia)
        });

        window.estadiaEditando = null;
    } else {
        await fetch(`${API_EST}/cadastrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(estadia)
        });
    }

    formEst.reset();
    listarEstadias();
});

async function listarEstadias() {
    const res = await fetch(`${API_EST}/listar`);
    const dados = await res.json();

    listaEst.innerHTML = "";

    dados.forEach(item => {
        listaEst.innerHTML += `
        <tr>
            <td>${item.id}</td>
            <td>${item.placa}</td>
            <td>${new Date(item.entrada).toLocaleString()}</td>
            <td>${item.saida ? new Date(item.saida).toLocaleString() : "Em aberto"}</td>
            <td>${item.valorTotal ? "R$ " + item.valorTotal.toFixed(2) : "-"}</td>
            <td>
                <button onclick="prepararEdicaoEstadia(${item.id}, '${item.placa}', ${item.valorHora})">
                    Editar
                </button>

                <button onclick="finalizar(${item.id})">
                    Finalizar
                </button>

                <button onclick="excluirEst(${item.id})">
                    Excluir
                </button>
            </td>
        </tr>`;
    });
}

function prepararEdicaoEstadia(id, placa, valorHora) {
    document.getElementById("placaEstadia").value = placa;
    document.getElementById("valorHora").value = valorHora;
    window.estadiaEditando = id;
}

async function finalizar(id) {
    await fetch(`${API_EST}/atualizar/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            saida: new Date()
        })
    });

    listarEstadias();
}

async function excluirEst(id) {
    await fetch(`${API_EST}/excluir/${id}`, {
        method: "DELETE"
    });

    listarEstadias();
}

listarAutomoveis();
listarEstadias();