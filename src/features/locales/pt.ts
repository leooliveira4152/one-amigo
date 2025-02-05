import { common } from "./common";
import { CharacterAttributes, CharacterCombatStats } from "../firebase/firestore/types";

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
  characterSheet: {
    header: {
      abilities: common.abilities,
      organization: common.organization,
    },
    main: {
      combatStats: {
        [CharacterCombatStats.ARMOR]: "Armadura",
        [CharacterCombatStats.DODGE]: "Esquiva",
        [CharacterCombatStats.HP]: "HP",
        [CharacterCombatStats.INITIATIVE]: "Iniciativa",
        [CharacterCombatStats.SPEED]: "Velocidade",
      },
      attributes: {
        [CharacterAttributes.CHARISMA]: "Carisma",
        [CharacterAttributes.CONSTITUTION]: "Constituição",
        [CharacterAttributes.DETERMINATION]: "Determinação",
        [CharacterAttributes.DEXTERITY]: "Destreza",
        [CharacterAttributes.INTELLIGENCE]: "Inteligência",
        [CharacterAttributes.STRENGTH]: "Força",
        [CharacterAttributes.WISDOM]: "Sabedoria",
      },
      skills: {
        athletics: "Atletismo",
        acrobatics: "Acrobacia",
        sleightOfHand: "Prestidigitação", // TODO - better translation?
        stealth: "Furtividade",
        arcana: "Arcanismo",
        history: "História",
        investigation: "Investigação",
        nature: "Natureza",
        religion: "Religião",
        animalHandling: "Trato de animais", // TODO - better translation?
        insight: "Intuição",
        medicine: "Medicina",
        perception: "Percepção",
        survival: "Sobrevivência",
        deception: "Enganação",
        intimidation: "Intimidação",
        performance: "Atuação",
        persuasion: "Persuasão",
      },
      deathSave: {
        title: "Testes de morte",
        fail: "Falhas",
        success: "Acertos",
      },
    },
    bottom: {
      tabs: {
        titles: {
          actions: common.actions,
          spells: common.abilities,
          inventory: "Inventário",
          features: "Características",
          background: "História",
        },
      },
      table: {
        name: "Nome",
        time: "Tempo",
        range: "Alcance",
        rangeUnit: "m",
        hitModifier: "Modificador de acerto",
        savingThrow: "Teste de resistência",
        effect: "Efeito",
        damage: "Dano",
        notes: "Notas",
        attributes: common.attributesAbv,
        effectTypes: common.effectTypes,
      },
      actions: {
        tabs: {
          all: "Todos",
          actions: common.actions,
          bonusActions: `${common.actions} bônus`,
          reaction: "Reações",
          others: "Outros",
        },
        attack: {
          subtitle: "Ataques por ação: {attacksPerAction}",
          attack: common.attack,
          range: "Alcance",
          rangeUnit: common.distanceUnit,
          hitModifier: "Acerto",
          savingThrow: "Teste de resistência",
          damage: "Dano",
          notes: "Notas",
        },
        valueDisplay: {
          base: "{value} (Base)",
          modifier: "{value} ({modifier}% de {attribute})",
          attributes: common.attributesAbv,
          damageTypes: common.damageTypes,
        },
      },
      abilities: {
        tabs: {
          all: "Todos",
          cantrip: "Truque",
          abilityLevel: "Nível {level}",
        },
      },
      inventory: {
        columns: {
          equipped: "Equipado",
          name: "Nome",
          quantity: "Quantidade",
          notes: "Notas",
        },
      },
      features: {
        tabs: { all: "Todos", character: "Personagem" },
        subtitle: "Características de {feature}",
      },
    },
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
      abilities: common.abilities,
      organization: common.organization,
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
