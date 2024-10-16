const common = {
  id: "Id",
  name: "Nome",
  roles: "Funções",
  create: "Criar",

  login: "Login",
};

const ptTranslation = {
  login: {
    login: common.login,
    enterAsSpectator: "Entrar como espectador",
  },
  header: {
    openCharacterSheet: "Personagem",
    login: common.login,
    logout: "Logout",
  },
  admin: {
    createAbility: {
      title: "Criar habilidade",
      name: common.name,
      id: common.id,
      description: "Descrição",
      magicSource: "Akuma no Kukki",
      submit: common.create,
      success: "Habilidade criada com sucesso",
    },
    createOrganization: {
      title: "Criar organização",
      name: common.name,
      id: common.id,
      roles: common.roles,
      pirateCrew: "Tripulação pirata",
      pirateCrewRoles: {
        captain: "Capitão",
        secondInCommand: "Vice-capitão",
        thirdInCommand: "Terceiro comandante",
        fourthInCommand: "Quarto comandante",
        fifthInCommand: "Quinto comandante",
        member: "Tripulante",
      },
      submit: common.create,
      success: "Organização criada com sucesso",
    },
    createCharacter: {
      title: "Criar personagem",
      name: common.name,
      nickname: "Apelido",
      ability: "Habilidade",
      organization: "Organização",
      roles: common.roles,
      submit: common.create,
      success: "Personagem criada com sucesso",
    },
  },
  error: {
    missingProperties: "As seguintes propriedades não foram informadas: {properties}",
    documentExist: "Documento já existe",
  },
  notFound: {
    message: "Como você veio parar aqui?",
    home: "Tela inicial",
  },
};

export default ptTranslation;
