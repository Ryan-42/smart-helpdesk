exports.analyze = (text) => {

    let categoria = "geral";
    let prioridade = "baixa";
    let sentimento = "neutro";
    let resposta = "Nossa equipe irá analisar seu chamado.";

    text = text.toLowerCase();

    if (text.includes("senha") || text.includes("login")) {
        categoria = "acesso";
        resposta = "Tente redefinir sua senha no portal interno.";
    }

    if (text.includes("internet") || text.includes("rede")) {
        categoria = "rede";
        prioridade = "alta";
    }

    if (text.includes("não funciona") || text.includes("urgente")) {
        prioridade = "alta";
        sentimento = "frustrado";
    }

    return {
        categoria,
        prioridade,
        sentimento,
        resposta
    };

};