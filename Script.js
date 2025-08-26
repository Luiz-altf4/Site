// Número do WhatsApp
const numeroWhatsApp = "5516999752710";

// ------------------- PEDIDOS -------------------
const pedidoForm = document.getElementById("pedidoForm");
const historico = document.getElementById("historicoPedidos");

if (pedidoForm) {
  pedidoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const ra = document.getElementById("ra").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const materia = document.getElementById("materia").value;
    const prazo = document.getElementById("prazo").value;
    const arquivoInput = document.getElementById("arquivo");
    const arquivo = arquivoInput.files[0];

    if (!arquivo) {
      alert("Selecione um arquivo da tarefa.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const pedido = {
        ra,
        whatsapp,
        materia,
        prazo,
        arquivo: reader.result,
        nomeArquivo: arquivo.name,
        data: new Date().toLocaleString()
      };

      // Salvar no localStorage
      let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      pedidos.push(pedido);
      localStorage.setItem("pedidos", JSON.stringify(pedido));

      // Enviar pro WhatsApp
      const msg = `📌 Novo Pedido\nRA/Nome: ${ra}\nWhatsApp: ${whatsapp}\nMatéria: ${materia}\nPrazo: ${prazo}`;
      window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank");

      pedidoForm.reset();
      mostrarHistorico();
    };
    reader.readAsDataURL(arquivo);
  });
}

// Mostrar histórico de pedidos
function mostrarHistorico() {
  if (!historico) return;
  historico.innerHTML = "";
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.forEach(p => {
    let li = document.createElement("li");
    li.textContent = `${p.ra} - ${p.materia} (Prazo: ${p.prazo})`;
    historico.appendChild(li);
  });
}
mostrarHistorico();

// ------------------- ENTREGAS (PAINEL PROTEGIDO) -------------------
const senhaCorreta = "1234";
const senhaForm = document.getElementById("senhaForm");
const entregaConteudo = document.querySelector(".entregaConteudo");

if (senhaForm) {
  senhaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const senha = document.getElementById("senha").value;
    if (senha === senhaCorreta) {
      senhaForm.parentElement.classList.add("hidden");
      entregaConteudo.classList.remove("hidden");
    } else {
      alert("Senha incorreta!");
    }
  });
}

// Cadastro de entregas
const entregaForm = document.getElementById("entregaForm");
const listaEntregas = document.getElementById("listaEntregas");
const buscarRA = document.getElementById("buscarRA");

if (entregaForm) {
  entregaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const ra = document.getElementById("raEntrega").value;
    const materia = document.getElementById("materiaEntrega").value;
    const arquivoInput = document.getElementById("arquivoEntrega");
    const arquivo = arquivoInput.files[0];

    if (!arquivo) {
      alert("Selecione um arquivo para enviar como entrega.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const entrega = {
        ra,
        materia,
        arquivo: reader.result,
        nomeArquivo: arquivo.name,
        data: new Date().toLocaleString()
      };

      let entregas = JSON.parse(localStorage.getItem("entregas")) || [];
      entregas.push(entrega);
      localStorage.setItem("entregas", JSON.stringify(entregas));

      entregaForm.reset();
      mostrarEntregas();
    };
    reader.readAsDataURL(arquivo);
  });
}

// Mostrar entregas
function mostrarEntregas(filtro = "") {
  if (!listaEntregas) return;
  listaEntregas.innerHTML = "";

  let entregas = JSON.parse(localStorage.getItem("entregas")) || [];
  entregas
    .filter(e => e.ra.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(e => {
      const li = document.createElement("li");
      li.innerHTML = `${e.ra} - ${e.materia} <a download="${e.nomeArquivo}" href="${e.arquivo}">📥 Baixar</a>`;
      listaEntregas.appendChild(li);
    });
}

// Buscar entregas por RA
if (buscarRA) {
  buscarRA.addEventListener("input", (e) => mostrarEntregas(e.target.value));
  mostrarEntregas();
}
