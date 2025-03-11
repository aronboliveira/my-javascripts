/*
interface FieldDescriptor {
  type: 'text'|'paragraph'|'multiple'|'checkbox'|'dropdown'|'scale'|'date'|'time'|'grid'|'checkboxGrid'|'file'|'section'|'break'|'image'|'video';
  title: string;
  helpText?: string;
  required?: boolean;
  choices?: string[];
  lowerBound?: number;
  upperBound?: number;
  url?: string
}
@param    string                    idf   
@param    Array<FieldDescriptor>    fields
@return   void
*/
function addQuestions(idf, fields) {
  try {
    const form = FormApp.openById(idf);
    if (!form) throw new ReferenceError(`Identifier invalid`);
    const lastItems = [],
      indexes = {
        eval: null,
        attach: null,
        error: null,
      },
      foundBasicFields = {
        name: false,
        contact: false,
      };
    for (let i = 0; i < form.getItems().length; i++) {
      const li = form.getItems()[i],
        title = li.getTitle();
      if (title?.trim().toLowerCase() === "nome") foundBasicFields.name = true;
      if (
        title
          ?.trim()
          .toLowerCase()
          .match(/^\s*Contato\s*\(e\-?mail\s*ou\s*telefone\)\s*$/i)
      )
        foundBasicFields.contact = true;
      const found = form
        .getItems()
        .findIndex(
          (item) =>
            item?.getTitle()?.toLowerCase().trim() ===
            title?.toLowerCase().trim()
        );
      found &&
        found !== -1 &&
        ![
          "Avalie sua satisfação com este formulário!",
          "Envie aqui anexos para o diagnóstico, caso queira:",
          "Caso haja uma mensagem de erro em tela, escreva a mesma aqui:",
        ].some((t) => t === li.getTitle()) &&
        !/satisfaç[ãa]o|anexos|erro.+tela/g.test(li.getTitle()) &&
        !/^(?:Contato|Nome)/i.test(li.getTitle()) &&
        form.deleteItem(li.getIndex());
      switch (title) {
        case "Avalie sua satisfação com este formulário!":
          lastItems.push(li);
          indexes.eval = 1;
          break;
        case "Envie aqui anexos para o diagnóstico, caso queira:":
          lastItems.unshift(li);
          indexes.attach = 1 + (indexes.eval ?? 0);
          break;
        case "Caso haja uma mensagem de erro em tela, escreva a mesma aqui:":
          lastItems.unshift(li);
          indexes.attach = 1 + (indexes.eval ?? 0) + (indexes.error ?? 0);
          break;
        default:
          break;
      }
    }
    if (!foundBasicFields.name) {
      const n = form.addTextItem().setTitle("Nome").setRequired(true);
      form.moveItem(n.getIndex(), 0);
      foundBasicFields.name = true;
    }
    if (!foundBasicFields.contact) {
      const c = form
        .addTextItem()
        .setTitle("Contato (e-mail ou telefone)")
        .setRequired(true);
      form.moveItem(c.getIndex(), 1);
      foundBasicFields.contact = true;
    }
    for (const field of fields) {
      if (
        form
          .getItems()
          .some(
            (it) =>
              it.getTitle()?.trim().toLowerCase() ===
              field.title?.trim().toLowerCase()
          )
      )
        continue;
      switch (field.type) {
        case "paragraph":
          form
            .addParagraphTextItem()
            .setTitle(field.title || "No title was given")
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "multiple":
          form
            .addMultipleChoiceItem()
            .setTitle(field.title || "No title was given")
            .setChoiceValues(field.choices || [])
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "checkbox":
          form
            .addCheckboxItem()
            .setTitle(field.title || "No title was given")
            .setChoiceValues(field.choices || [])
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "dropdown":
          form
            .addListItem()
            .setTitle(field.title || "No title was given")
            .setChoiceValues(field.choices || [])
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "scale":
          form
            .addScaleItem()
            .setTitle(field.title || "No title was given")
            .setBounds(field.lowerBound || 1, field.upperBound || 5)
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "date":
          form
            .addDateItem()
            .setTitle(field.title || "No title was given")
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "time":
          form
            .addTimeItem()
            .setTitle(field.title || "No title was given")
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "checkboxGrid":
          form
            .addCheckboxGridItem()
            .setTitle(field.title || "No title was given")
            .setRows(field.choices || [])
            .setColumns(field.choices || [])
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "grid":
          form
            .addGridItem()
            .setTitle(field.title || "No title was given")
            .setRows(field.choices || [])
            .setColumns(field.choices || [])
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "file":
          form
            .addFileUploadItem()
            .setTitle(field.title || "No title was given")
            .setRequired(field.required || false)
            .setHelpText(field.helpText || "");
          break;
        case "section":
          form
            .addSectionHeaderItem()
            .setTitle(field.title || "No title was given")
            .setHelpText(field.helpText || "");
          break;
        case "break":
          form
            .addPageBreakItem()
            .setTitle(field.title || "No title was given")
            .setHelpText(field.helpText || "");
          break;
        case "image":
          form
            .addImageItem()
            .setTitle(field.title || "No title was given")
            .setHelpText(field.helpText || "");
          break;
        case "video":
          form
            .addVideoItem()
            .setTitle(field.title || "No title was given")
            .setVideoUrl(field.url || "")
            .setHelpText(field.helpText || "");
          break;
        default:
          form
            .addTextItem()
            .setTitle(field.title || "No title was given")
            .setRequired(field.required || false)
            .setHelpText(field.setHelpText || "");
      }
    }
    for (let i = 0; i < lastItems.length; i++) {
      const li = lastItems[i],
        index = li.getIndex();
      switch (li.getTitle()) {
        case "Avalie sua satisfação com este formulário!":
          form.moveItem(index, form.getItems().length - 1);
          break;
        case "Envie aqui anexos para o diagnóstico, caso queira:":
          form.moveItem(index, form.getItems().length - (indexes.eval ? 1 : 0));
          break;
        case "Caso haja uma mensagem de erro em tela, escreva a mesma aqui:":
          form.moveItem(
            index,
            form.getItems().length -
              (indexes.eval ? 1 : 0) -
              (indexes.attach ? 1 : 0)
          );
          break;
        default:
          continue;
      }
    }
  } catch (e) {
    Logger.log(
      `Failed to execute addQuestions at ${new Date()}: ${e.name} — ${
        e.message
      }`
    );
  }
}
const os = [
    {
      title: "Qual é o Sistema Operacional usado?",
      type: "dropdown",
      choices: [
        ...["10", "11", "8", "anterior ao 8"].map((w) => `Windows ${w}`),
        "Distribuição Linux",
        "macOS",
        "Android",
        "iOS",
        "Outros",
        "Não sei responder",
      ],
    },
    {
      title:
        'Caso tenha escolhido "Outros" ou "Distribuição Linux" na opção anterior, por favor detalhar:',
      type: "text",
    },
    {
      title:
        'Caso tenha escolhido "macOS", "Android" ou "iOS", por favor inserir a versão aqui:',
      type: "text",
    },
  ],
  bwr = [
    {
      title: "Qual é o Navegador utilizado, caso esta seja a plataforma?",
      type: "dropdown",
      choices: [
        "360 Secure Browser",
        "Android WebView",
        "Avant Browser",
        "Avast Secure Browser",
        "Basilisk",
        "Brave",
        "Chromium",
        "Coowon",
        "Comodo Dragon",
        "Cốc Cốc",
        "Dooble",
        "DuckDuckGo Browser",
        "Ecosia",
        "Epic Privacy Browser",
        "Falkon",
        "Fennec",
        "Flock",
        "Ghostery Privacy Browser",
        "GNOME Web (Epiphany)",
        "Google Chrome",
        "GreenBrowser",
        "IceCat",
        "IceDragon",
        "Iceweasel",
        "Internet Explorer",
        "Iridium",
        "Iron",
        "K-Meleon",
        "Konqueror",
        "Links",
        "Lunascape",
        "Lynx",
        "Maxthon",
        "Maxthon Nitro",
        "Microsoft Edge",
        "Midori",
        "Mozilla Firefox",
        "Naver Whale",
        "Netsurf",
        "Opera",
        "Orbitum",
        "Otter Browser",
        "Outdated Browser",
        "Pale Moon",
        "Photon",
        "Puffin",
        "QQ Browser",
        "Qutebrowser",
        "RockMelt",
        "Safari",
        "Samsung Internet",
        "SeaMonkey",
        "Sleipnir",
        "SlimBrowser",
        "Sogou Explorer",
        "SRWare Iron",
        "SuperBird",
        "Tor Browser",
        "UC Browser",
        "Vivaldi",
        "Waterfox",
        "Wyzo",
        "Yandex Browser",
      ],
    },
  ],
  yn = {
    type: "multiple",
    choices: ["Sim", "Não"],
  },
  yn_2 = {
    type: "multiple",
    choices: ["Sim", "Não", "Não sei responder"],
  },
  contactApp = {
    title:
      "Nome do Serviço ou Aplicativo utilizado (ex.: Gmail, WhatsApp, Outlook, Salesforce, VPN Corporativa, etc.):",
    required: true,
  },
  device = {
    title:
      "Modelo do Dispositivo utilizado (responda ao menos com o nome do fabricante, procurando em etiquetas ou gravações físicas):",
  },
  sharing = {
    type: "multiple",
    choices: ["Corporativa", "Pessoal"],
  },
  contractStart = [
    {
      title: "CPF ou CNPJ do titular do contrato",
      required: true,
    },
    {
      title: "Qual é o tipo de contrato que você deseja iniciar?",
      type: "multiple",
      choices: ["Prestação de Serviço", "Mensal"],
      required: true,
    },
    {
      title: "Qual é a duração desejada do contrato, caso seja mensal?",
    },
    {
      title: "Quais são as formas de pagamento a serem sugeridas?",
    },
    {
      title:
        "Use este espaço para incluir necessidade específicas a serem incluídas (ex.: cláusulas personalizadas, formas de pagamento diferenciadas)",
      type: "paragraph",
    },
  ],
  mailDirs = [
    {
      title:
        "Pastas da caixa de e-mail afetada (principal, social, customizadas, etc.)",
    },
  ],
  btVers = ["5G", "4G", "3G", "2G", "LTE"].map((g) => `Rede Móvel ${g}`),
  wiFiVers = ["Wi-Fi 4", "Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"].flatMap(
    (g) => [
      ...(g.includes("4") ||
      g.includes("7") ||
      (g.includes("6") && !g.endsWith("E"))
        ? [`${g} - 2.4 GHz`]
        : []),
      ...(!g.includes("6E") ? [`${g} - 5 GHz`] : []),
      ...(g.includes("6E") ? [`${g} - 6 GHz`] : []),
      ...(g.includes("7") ? [`${g} - 6 GHz`, `${g} - Multi-Link`] : []),
    ]
  ),
  nwType = {
    title:
      "Qual é o tipo de rede que você estava utilizando durante a chamada?",
    type: "dropdown",
    choices: [
      ...wiFiVers,
      ...btVers,
      "Ethernet",
      "Bluetooth",
      "VPN",
      "Satélite",
      "Dial-Up",
      "Rede Mesh",
      "Ponto de Acesso Móvel",
    ],
  },
  audioErrors = {
    title:
      "Quais destes tópicos você consegue identificar que têm relação com o seu problema na Tranmissão de áudio?",
    type: "checkbox",
    choices: [
      "Sem áudio na chamada",
      "Áudio distorcido/embaralhado",
      "Eco na chamada",
      "Volume muito baixo",
      "Cortes intermitentes de áudio",
      "Ruído de fundo excessivo",
      "Latência no áudio (atraso)",
      "Microfone não detectado",
      "Áudio unilateral (apenas uma parte ouve)",
      "Voz robótica ou digitalizada",
      "Incompatibilidade de codec de áudio",
      "Problemas de driver de áudio",
      "Falha de hardware (ex: alto-falante quebrado)",
    ],
  },
  videoErrors = {
    title:
      "Quais destes tópicos você consegue identificar que têm relação com o seu problema na Transmissão de vídeo?",
    type: "checkbox",
    choices: [
      "Sem transmissão de vídeo",
      "Qualidade de vídeo granulada/pixelada",
      "Vídeo congelando repetidamente",
      "Atraso entre áudio e vídeo",
      "Tela preta durante a chamada",
      "Vídeo borrado ou fora de foco",
      "Queda de resolução repentina",
      "Câmera não detectada",
      "Flickering ou cintilação na imagem",
      "Problemas de largura de banda (vídeo pixelado)",
      "Incompatibilidade de codec de vídeo",
      "Problemas de driver da câmera",
      "Falha de hardware (ex: câmera danificada)",
    ],
  },
  teleComCompanies = [
    {
      title:
        "Qual era a operadora de Telecomunicação no dispositivo em que você fez a chamada?",
      type: "dropdown",
      choices: [
        "Algar Telecom",
        "Claro Brasil",
        "Copel Telecom",
        "Embratel",
        "GVT (Global Village Telecom)",
        "Nextel Brasil",
        "Oi",
        "Sercomtel",
        "Sky Brasil (Divisão de Telecomunicação)",
        "Telefônica Brasil (Vivo)",
        "TIM Brasil",
        "Vivo (Telefônica Brasil)",
        "Outra",
      ],
      required: true,
    },
    {
      title: 'Se você escolheu "Outra" na operação anterior, detalhe aqui:',
    },
  ],
  plugTypes = [
    "USB A",
    "USB Mini A",
    "USB Micro A",
    "USB B",
    "USB Mini B",
    "USB Micro B",
    "USB C",
    "Lightning",
    "Thunderbolt",
    "HDMI",
    "DisplayPort",
    "Outro",
    "Não reconheço nenhum dos formatos",
  ],
  generalConnectors = [
    ...plugTypes,
    "Anderson Powerpole",
    "Apple 30-pin",
    "Apple Smart Connector",
    "Barrel Jack",
    "Cloverleaf",
    "DE-9",
    "eSATA",
    "Figure-8",
    "FireWire (IEEE 1394)",
    "DC Connector",
    "DIN",
    "DisplayPort Mini",
    "DVI",
    "IEC C5",
    "IEC C13/C14",
    "IEC C19/C20",
    "JST",
    "MagSafe",
    "MagSafe 2",
    "MagSafe 3",
    "Mini DIN",
    "Molex",
    "Pogo Pin",
    "RJ11",
    "RJ45",
    "SAE",
    "SCART",
    "T-Slot",
    "USB BC",
    "USB PD",
    "USB On-The-Go (OTG)",
    "VGA",
    "XT60",
    "XT90",
    "Proprietário",
    "Outro",
    "Não reconheço nenhum dos formatos",
  ]
    .sort((a, b) => a.toString().localeCompare(b))
    .reduce((ac, it) => {
      if (
        /^(?:não\s+reconhe[çc]o\s+nenhum\s+dos\s+formatos?|outro|propriet[áa]rio)/i.test(
          it
        )
      )
        ac.push(it);
      else ac.unshift(it);
      return ac;
    }, [])
    .filter((item, index, array) => array.indexOf(item) === index)
    .filter(Boolean),
  avConnectors = [
    "HDMI",
    "VGA",
    "DisplayPort",
    "DVI",
    "Thunderbolt",
    "USB-C",
    "Mini DisplayPort",
    "Component Video (RCA)",
    "Composite Video (RCA)",
    "S-Video",
    "SCART",
    "BNC",
    "SDI",
    "HDBaseT",
    "MHL (Mobile High-Definition Link)",
    "Outro",
    "Não reconheço nenhum dos formatos",
  ]
    .sort((a, b) => a.localeCompare(b))
    .reduce((ac, it) => {
      if (
        /^(?:não\s+reconhe[çc]o\s+nenhum\s+dos\s+formatos?|outro|propriet[áa]rio)/i.test(
          it
        )
      )
        ac.push(it);
      else ac.unshift(it);
      return ac;
    }, [])
    .filter((item, index, array) => array.indexOf(item) === index)
    .filter(Boolean),
  driverUpdate = {
    title:
      "Caso tenha realizado atualizações recentes no driver do dispositivo, insira aqui a data da última atualização:",
    type: "date",
  },
  osPciWarn = {
    title:
      "Marque as formas com que o Sistema Operacional reconhece o dispositivo (se houver reconhecimento)",
    type: "checkbox",
    choices: [
      "Janelas de aviso",
      "Alertas Sonoros",
      "Listagem em Gerenciadores",
    ],
  },
  deviceRes = {
    title:
      "O dispositivo apresenta alguma forma de resposta ou está totalmente inativo?",
    required: true,
    type: "multiple",
    choices: [
      "Sem resposta",
      "Apresenta resposta, mas é inconsistente",
      "Não há problemas para responder",
    ],
  };
let shouldProcced = "";
const mainList = [
  {
    id: "FORM_1",
    fields: [
      ...os,
      ...bwr,
      {
        title: "Você recebeu um e-mail para resetar a sua senha?",
        ...yn,
      },
      contactApp,
    ],
  },
  {
    id: "FORM_2",
    fields: [
      device,
      ...os,
      ...bwr,
      contactApp,
      {
        title:
          "Se a sua conexão utiliza VPN, escolha se esta é corporativa ou pessoal:",
        ...sharing,
      },
      {
        title:
          "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
        ...sharing,
      },
      {
        title: "Data do bloqueio:",
        type: "date",
      },
      {
        title: "Horário (estimado ou exato) do bloqueio:",
        type: "time",
      },
    ],
  },
  {
    id: "FORM_3",
    fields: [
      ...os,
      ...bwr,
      contactApp,
      {
        title:
          "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
        ...sharing,
      },
      {
        title: "Tipo de Fator de Multiautenticação",
        type: "dropdown",
        required: true,
        choices: [
          "SMS",
          "Google Authenticator",
          "Microsoft Authenticator",
          "Authy",
          "Token Físico",
          "Biometria (Digital, Facial, Iris)",
          "Push Notification",
          "E-mail",
          "Backup Codes",
          "YubiKey",
          "Smart Card",
          "Certificado Digital",
          "One-Time Password (OTP)",
          "Duo Security",
          "RSA SecurID",
          "Symantec VIP",
          "LastPass Authenticator",
          "Okta Verify",
          "PingID",
          "FIDO2 Security Key",
        ],
      },
      {
        title: "Existem códigos de Backup?",
        type: "multiple",
        ...yn,
      },
    ],
  },
  {
    id: "FORM_4",
    fields: [
      ...bwr,
      device,
      contactApp,
      {
        title:
          "Você já tentou limpar cookies e/ou cache no Aplicativo e/ou o Serviço usado?",
        ...yn,
      },
      {
        title: "Nome do provedor de SSO, se tiver acesso",
      },
      {
        title:
          "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
        ...sharing,
      },
      {
        title: "Quantas tentativas de acesso já foram feitas?",
      },
      {
        title: "Existem códigos de Backup?",
        type: "multiple",
        ...yn,
      },
    ],
  },
  {
    id: "FORM_5",
    fields: [
      ...bwr,
      device,
      contactApp,
      {
        title: "Quantas tentativas de reconfiguração já houveram?",
      },
      {
        title: "Qual é o tipo de biometria em questão?",
        type: "dropdown",
        choices: [
          "Facial",
          "Digital",
          "Iris",
          "Voz",
          "Veias da Palma",
          "Reconhecimento de Padrões de Veias",
          "Reconhecimento de Assinatura",
          "Reconhecimento de Digitação",
          "Reconhecimento de Andar",
          "Reconhecimento de Forma da Orelha",
          "Reconhecimento de Odor",
          "Reconhecimento de DNA",
        ],
      },
    ],
  },
  {
    id: "FORM_6",
    fields: [
      {
        title: "Você precisa cadastrar, atualizar ou recuperar informações?",
        type: "multiple",
        choices: ["Cadastrar", "Atualizar", "Recuperar"],
      },
      {
        title:
          "O problema envolve relacionamento com clientes, suporte após prestação de serviço ou suporte contratual?",
        type: "multiple",
        choices: [
          "Relacionamento com clientes",
          "Suporte após prestação de Serviço",
          "Suporte Contratual",
        ],
      },
      {
        title:
          "Existe necessidade de expansão da rede de representantes ou parceiros?",
        ...yn,
      },
    ],
  },
  {
    id: "FORM_7",
    fields: [...contractStart],
  },
  {
    id: "FORM_8",
    fields: [
      {
        title:
          "Qual é o número ou identificação do contrato que deseja alterar?",
        required: true,
      },
      {
        title: "Qual tipo de alteração é necessária?",
        type: "paragraph",
        required: true,
      },
    ],
  },
  {
    id: "FORM_9",
    fields: [
      {
        title: "Qual é o número ou identificação do contrato a ser encerrado?",
        required: true,
      },
      {
        title: "Qual o motivo do encerramento do contrato?",
        type: "dropdown",
        choices: [
          "O serviço não atendeu às necessidades",
          "Questões financeiras",
          "Encerramento de atividades",
          "Mudança de fornecedor",
          "Insatisfação com o atendimento",
          "Problemas técnicos recorrentes",
          "Falta de suporte adequado",
          "Mudança de estratégia da empresa",
          "Redução de custos",
          "Fim do período de contrato sem renovação",
          "Desacordo com termos e condições",
          "Falta de atualizações ou inovações no serviço",
          "Mudança de prioridades da empresa",
          "Falta de integração com outros sistemas",
          "Problemas de segurança ou privacidade",
          "Outro motivo",
        ],
      },
      {
        title: 'Caso tenha escolhido "Outros" na opção anterior, detalhe aqui:',
      },
      {
        title:
          "Você já está ciente de possíveis quebras de cláusulas de fidelidade ou multas por rescisão antecipada?",
        required: true,
        ...yn,
      },
      {
        title: "Você deseja negociar valores pendentes?",
        required: true,
        ...yn,
      },
      {
        title:
          "Use este espaço livremente para deixar feedbacks sobre o serviço, experiências e suas motivações",
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_10",
    fields: [
      ...os,
      {
        title:
          "Nome específico (ou indicativo) da configuração defeituosa ou em necessidade de ajuste",
        required: true,
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_11",
    fields: [
      {
        title: "Nome da Configuração, Recurso ou Ferramenta que deseja ajustar",
        required: true,
      },
      ...bwr,
    ],
  },
  {
    id: "FORM_12",
    fields: [
      ...bwr,
      ...mailDirs,
      {
        title:
          'Dados sobre frequência de sincronização (procure alguma informação como "Última sincronização" nas mensagens ou configuração do seu aplicativo)',
        required: true,
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_13",
    fields: [
      ...bwr,
      ...mailDirs,
      {
        title: "Remetente (endereço de envio relacionado) do e-mail",
        required: true,
      },
      {
        title: "Assunto do e-mail",
        required: true,
      },
      {
        title:
          "Corpo e cabeçalho do e-mail (não copie e cole, envie prints ou descreva)",
        type: "paragraph",
      },
      {
        title: "Assinatura do e-mail",
      },
      {
        title:
          "Quais categorias de dados comprometedores sobre você ou a sua empresa o e-mail apresenta?",
        required: true,
      },
      {
        title:
          "O agressor apresentou algum tipo de evidência factível sobre suas atividades recentes?",
        required: true,
        ...yn,
      },
      {
        title:
          'O agressor apresentou alguma forma de apresentação explícita (ex.: "Sou um hacker!")',
        required: true,
        ...yn,
      },
      {
        title: "Foi feita alguma forma de tentativa de extorção na mensagem?",
        required: true,
        ...yn,
      },
      {
        title:
          "O agressor o/a contatou ou afetou de alguma maneira que não seja o e-mail em questão?",
        required: true,
        ...yn,
      },
      {
        title: "Você respondeu ao agressor de alguma forma?",
        required: true,
        ...yn,
      },
      {
        title: "Se sim para o último caso, por favor detalhe aqui:",
        type: "paragraph",
      },
      {
        title:
          "Você acessou algum hyperlink ou baixou algum arquivo apresentado pelo agressor?",
        required: true,
        ...yn,
      },
      {
        title:
          "Se sim para o último caso, detalhe (sem enviar os links e/ou arquivos relacionados)",
        type: "paragraph",
      },
      {
        title:
          "Você reconhece de alguma forma algum dos dados do agressor (endereço, nome, etc.)?",
        required: true,
        ...yn,
      },
    ],
  },
  {
    id: "FORM_13",
    fields: [device, ...os, ...bwr, nwType, audioErrors, videoErrors],
  },
  {
    id: "FORM_14",
    fields: [device, ...os, ...bwr, nwType, audioErrors],
  },
  {
    id: "FORM_15",
    fields: [device, audioErrors, ...teleComCompanies],
  },
  {
    id: "FORM_16",
    fields: [
      ...os,
      ...bwr,
      {
        title:
          "Caso seja uma ou algumas das ferramentas especificamente causando problemas, relate aqui:",
        type: "paragraph",
      },
      {
        title:
          "Qual era o número aproximado de abas abertas durante os momentos de falha?",
        type: "dropdown",
        choices: ["1", "2 a 5", "5 a 10", "10 a 20", "mais de 20"],
      },
      {
        title: "Sobre o seu carregamento, as páginas:",
        type: "multiple",
        choices: [
          "Não carregam",
          "Carregam parcialmente",
          "Carregam de forma inesperada, com inconsistências visuais e bugs",
          "Carregam sem Problemas",
        ],
      },
      {
        title: "Nos casos críticos, o navegador:",
        required: true,
        type: "multiple",
        choices: [
          "Colapsa completamente e interrompe o seu processo",
          "se mantém ativo mesmo que de forma muito prejudicada",
        ],
      },
      {
        title:
          "Você já testou alterações na otimização gráficas da configuração do navegador?",
        ...yn,
      },
      {
        title: "Você já realizou testes similares em outros navegadores?",
        ...yn,
      },
      {
        title: "Assinale extensões que você utiliza no seu navegador:",
        type: "checkbox",
        choices: [
          "AdBlock",
          "Grammarly",
          "LastPass",
          "Dark Reader",
          "uBlock Origin",
          "Privacy Badger",
          "HTTPS Everywhere",
          "Tree Style Tab",
          "Microsoft Editor",
          "Pinterest Save Button",
          "Amazon Assistant",
          "Evernote Web Clipper",
          "1Password",
          "Honey",
          "Momentum",
          "Ghostery",
          "Wappanalyzer",
        ],
      },
      {
        title: "Caso utilize outras extensões e/ou plugins, liste aqui:",
        type: "paragraph",
      },
      {
        title:
          "Você utilizou o Console do navegador de alguma forma?\n\nO mesmo é aberto com Inspecionador (F12) + aba Console",
        type: "multiple",
        choices: ["Sim", "Não", "Não tenho certeza"],
      },
      {
        title: `Caso possível, envie-nos mensagens de Erro no console escrevendo aqui ou deixando como um print (tecla Print Screen) anexado.

        Para acessar:

        1. Clique com o botão direito em um espaço vazio da página + Inspecionar (ou somente aperte F12 na maioria dos navegadores e páginas);
        2. Vá na aba Console no cabeçalho da divisória aberta e clique;
        3. Na subdivisória ao lado esquerdo da mesma divisória anterior, clique em "Erros" ou "Errors". O mesmo título conterá uma contagem antecedendo.`,
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_17",
    fields: [
      {
        titles:
          "Escolha qual destas classes de problemas está mais bem relacionada à sua questão",
        type: "dropdown",
        required: true,
        choices: [
          "Problema ao salvar dados",
          "Dados não encontrados",
          "Erro ao enviar e-mail",
          "Relatório não gerado",
          "Acesso negado",
          "Falha na integração com outro sistema",
          "Erro ao imprimir documento",
          "Lentidão no sistema",
          "Erro ao fazer login",
          "Dados duplicados",
          "Erro ao processar pagamento",
          "Falha na sincronização de dados",
          "Erro ao atualizar informações",
          "Problema com a interface do usuário",
          "Erro ao importar/exportar dados",
          "Falha na autenticação",
          "Erro ao criar novo usuário",
          "Problema com notificações",
          "Erro ao configurar permissões",
          "Falha na conexão com o servidor",
        ],
      },
    ],
  },
  {
    id: "FORM_18",
    fields: [
      {
        title:
          "Escolha qual destas classes de problemas está mais bem relacionada à sua questão",
        type: "dropdown",
        required: true,
        choices: [
          "Problema de Login ou Autenticação",
          "Aplicativo Travando ou Congelando",
          "Desempenho Lento",
          "Dados Não Salvos",
          "Problema de Sincronização de Dados",
          "Arquivo Não Carregado",
          "Arquivo Não Baixado",
          "Dados Exibidos Incorretamente",
          "Dados Faltando",
          "Dados Duplicados",
          "Problema de Formatação",
          "Integração Não Funcionando",
          "Falha na API ou Automação",
          "Permissão Negada",
          "Funcionalidade Não Funcionando",
          "Falha na Interface ou Problema de Exibição",
          "Cálculo Incorreto",
          "Aplicativo Não Responde",
          "Problema de Conexão com a Internet",
          "Armazenamento Cheio",
          "Arquivo Corrompido",
          "Serviço de Terceiros Indisponível",
          "Entrada de Dados Incorreta",
          "Problema com Atualização do Aplicativo",
          "Problema de Acessibilidade",
          "Formato de Arquivo Não Suportado",
          "Erro em Script ou Macro",
          "Comportamento Inesperado",
          "Aplicativo Não Carrega",
          "Permissões Incorretas",
          "Falha na Exportação/Importação de Dados",
          "Problema de Colaboração",
          "Notificação Não Funcionando",
          "Função de Busca Não Funcionando",
          "Aplicativo Trava em um Dispositivo Específico",
          "Aplicativo Trava em um Navegador Específico",
          "Aplicativo Trava em um Sistema Operacional Específico",
          "Fuso Horário ou Data/Hora Incorretos",
          "Idioma Exibido Incorretamente",
          "Outro",
        ],
      },
      {
        title:
          'Caso tenha escolhido "Outro" na opção anterior, por favor descreva aqui:',
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_19",
    fields: [
      ...os,
      {
        title: "Qual é o modelo do Dispositivo de Armazenamento?",
        required: true,
      },
      {
        title: "Qual é a capacidade total de armazenamento do dispositivo?",
        type: "dropdown",
        required: true,
        choices: [
          "Menos de 128 GB",
          "128 GB",
          "256 GB",
          "512 GB",
          "1 TB",
          "2 TB",
          "Mais de 2 TB",
          "Não sei responder",
        ],
      },
      {
        title: "Seu dispositivo de armazenamento é externo ao computador?",
        required: true,
        ...yn,
      },
      {
        title:
          "Caso o dispositivo seja externo, qual é o tipo de conexão de saída (para plugar no computador) do seu cabo principal?",
        type: "dropdown",
        choices: [...plugTypes, "Não reconheço nenhuma das opções"],
      },
      {
        title:
          "Caso tenha escolhido que a conexão de saída não foi reconhecida nas opções, detalhe aqui:",
      },
      {
        title:
          "Caso o dispositivo seja externo, qual é o tipo de conexão de entrada (para plugar no computador) do seu cabo principal?",
        type: "dropdown",
        choices: [...plugTypes, "Não reconheço nenhuma das opções"],
      },
      {
        title:
          "Caso tenha escolhido que a conexão de entrada não foi reconhecida nas opções, detalhe aqui:",
      },
      {
        title:
          "Caso o dispositivo seja externo, já houve uma tentativa de reconexão no mesmo dispositivo?",
        ...yn,
      },
      {
        title:
          "Caso o dispositivo seja externo, já houve uma tentativa de conexão em outros dispositivos?",
        ...yn,
      },
      {
        title:
          "O dispositivo é reconhecido pelo Sistema Operacional (visível através de notificações e/ou gerenciadores)?",
        required: true,
        ...yn_2,
      },
      {
        title:
          "Se respondeu que o dispositivo é reconhecido pelo Sistema Operacional, assinale de onde você conseguiu esse dado",
        type: "checkbox",
        choices: [
          "Gerenciador de Dispositivos",
          "Gerenciador de Discos",
          "Popup e/ou alertas automáticos do Sistema",
          "Alertas sonoros",
          "Softwares de Terceiros",
          "Interface de Linha de Comando | Terminal",
          "Outro",
        ],
      },
      {
        title:
          "Caso tenha respondido que o Sistema Operacional reconheceu o dispositivo de armazenamento de outra forma, detalhe aqui:",
      },
      {
        title:
          "Caso tenha escolhido que o dispositivo é reconhecido pelo Sistema Operacional e que observou isso em Softwares de Terceiros, aponte aqui o nome do Software e o recurso que permitiu essa identificação:",
        type: "paragraph",
      },
      {
        title: "A sua máquina está mais lenta do que o esperado?",
        required: true,
        ...yn_2,
      },
      {
        title:
          "Se o dispositivo é externo, há alteração de velocidade ou travamento na máquina quando este está conectado?",
        ...yn_2,
      },
      {
        title:
          "Houve alguma forma de incidente que possa ter causado dano físico recente no dispositivo de armazenamento (queda, superaquecimento, excesso de umidade, etc.)?",
        required: true,
        ...yn_2,
      },
      {
        title:
          "Você já realizou backups dos dados no dispositivo de armazenamento em questão?",
        required: true,
        ...yn,
      },
      {
        title:
          "Se realizou backup do dispositivo de armazenamento, qual é a data do último backup?",
        type: "date",
      },
    ],
  },
  {
    id: "FORM_20",
    fields: [
      ...os,
      {
        title: "Qual é o modelo da Placa-mãe, se encontrado?",
      },
      {
        title: "Qual é o modelo da memória RAM, se encontrado?",
      },
      {
        title: "Qual é o modelo do Processador, se encontrado?",
      },
      {
        title:
          "Qual é a forma de alimentação de energia através da qual o seu dispositivo apresenta problema?",
        type: "dropdown",
        choices: [
          "Reserva de Bateria",
          "Conexão direta com Eletricidade",
          "Carregadores móveis com fio",
          "Carregadores móveis sem fio",
          "Outro",
        ],
      },
      {
        title:
          "Se você escolheu que a fonte de alimentação de energia é de outro tipo, detalhe:",
      },
      {
        title:
          "Caso tenha escolhido que o problema envolve uma conexão de energia, qual é o formato do conector que é plugado no dispositivo a ser carregado?",
        type: "dropdown",
        choices: generalConnectors,
      },
      {
        title:
          'Caso tenha escolhido que o formato do conector que é plugado no dispositivo a ser carregado corresponde a "Proprietário" ou "Outros", detalhe:',
      },
      {
        title:
          "Caso o conector para a fonte de energia seja conectado diretamente em uma fonte de eletricidade, qual é o formato do conector?",
        type: "dropdown",
        choices: [
          "N (Três Pinos Padrão)",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "O",
        ],
      },
      {
        title:
          "Caso tenha escolhido que o problema envolve um carregador móvel com fio, qual é o formato do conector que é plugado no dispositivo de carregamento portátil?",
        type: "dropdown",
        choices: generalConnectors,
      },
      {
        title:
          'Caso tenha escolhido que o formato do conector que é plugado no dispositivo de carregamento portátil corresponde a "Proprietário" ou "Outros", detalhe:',
      },
      {
        title:
          "Caso tenha escolhido que o problema envolve um carregador móvel sem fio, qual é o tipo de tecnologia usada?",
        type: "dropdown",
        choices: [
          "AirFuel (Rezence)",
          ...[
            "2.0",
            "2.1",
            ,
            "3.0",
            "4.0",
            "4.1",
            "4.2",
            "5.0",
            "5.1",
            "5.2",
            "5.3",
          ].map((v) => `Bluetooth ${v}`),
          "Qi",
          "Infravermelho (IR)",
          "Laser",
          "Power Matters Alliance (PMA)",
          "Radiofrequência (RF)",
          "Ultrassom",
        ],
      },
      {
        title:
          "Houve algum incidente que possa ter causado dano físico em algum dos componentes para fornecimento e uso de energia (queda, rompimento, superaquecimento, excesso de umidade, etc.)? Se sim, detalhe:",
        required: true,
        type: "paragraph",
      },
      {
        title:
          "Se há alguma manifestação física que possa acarretar danos nos dispositivos (eletricidade visível, sons inesperados, superaquecimento, etc), detalhe aqui:",
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_21",
    fields: [
      {
        title: "Qual é o tipo de dispositivo de imagem utilizado?",
        required: true,
        type: "dropdown",
        choices: [
          "Monitor",
          "Televisão",
          "Display de tela de dispositivo móvel",
          "Outro",
        ],
      },
      {
        title:
          'Caso tenha respondido "Outro" para o dispositivo de image utilizado, detalhe:',
      },
      {
        title:
          "Caso tenha respondido que o dispositivo é um monitor, este é integrado na máquina ou conectado externamente?",
        type: "multiple",
        choices: ["Integrado", "Conectado externamente", "Não sei responder"],
      },
      {
        title:
          "As imagens aparecendo em tela estão com alguma forma de distorção de gráficos?",
        ...yn,
      },
      {
        title: `Caso haja falha nas cores, detalhe aqui quais cores você identifica que estão com resultado inesperado:

        (Você pode organizar em grupo, como: tons de vermelho | tons de verde | tons de azul)`,
        type: "paragraph",
      },
      {
        title:
          "As imagens aparecendo em tela estão com alguma falha nas cores?",
        ...yn,
      },
      {
        title:
          "Qual é o modelo do dispositivo de imagem (responda com ao menos o nome do fabricante)?",
      },
      {
        title: "A tela do dispositivo de imagem está:",
        type: "multiple",
        required: true,
        choices: [
          "Completamente apagada",
          "Aparecendo parcialmente",
          "Aparecendo completamente",
        ],
      },
      {
        title:
          "Caso o dispositivo de imagem seja conectado externamente, qual é o tipo de conector utilizado para ligar o seu dispositivo de imagem (ex.: monitor ou televisão) no seu dispositivo principal?",
        type: "dropdown",
        choices: avConnectors,
      },
      {
        title:
          'Caso tenha respondido "Outro" para o conector que pluga no dispositivo principal, detalhe aqui:',
      },
      {
        title:
          "Caso o dispositivo de imagem seja conectado externamente, qual é o tipo de conector utilizado para ligar o seu dispositivo principal no de imagem (ex.: monitor ou televisão)?",
        type: "dropdown",
        choices: avConnectors,
      },
      {
        title:
          'Caso tenha respondido "Outro" para o conector que pluga no dispositivo de imagem, detalhe aqui:',
      },
      ...os,
      {
        title:
          "Caso o dispositivo de imagem seja conectado externamente, você já realizou testes com outros cabos?",
        ...yn,
      },
      {
        title:
          "Caso o dispositivo de imagem seja conectado externamente, você já realizou testes em outros dispositivos principais?",
        ...yn,
      },
      {
        title:
          "Caso tenha realizado atualizações de drivers para o dispositivo de imagem, deixe aqui a data da atualização mais recente:",
        type: "date",
      },
      osPciWarn,
      {
        title:
          "Houve alguma forma de incidente (ex.: superaquecimento, quedas, acúmulo de umidade, etc.) que possa ter causado danos físicos no dispositivo de imagem ou no dispositivo principal? Se sim, detalhe aqui:",
        required: true,
        type: "paragraph",
      },
      {
        title:
          "O dispositivo de imagem ou principal apresenta alguma manifestação física que indica condição de falha (ex.: ruídos inesperados, eletricidade visível, aumento grave de temperatura, etc.)? Se sim, detalhe aqui:",
        required: true,
        type: "paragraph",
      },
    ],
  },
  {
    id: "FORM_22",
    fields: [
      {
        title: "O dispositivo em questão é um:",
        required: true,
        type: "multiple",
        choices: ["Mouse", "Teclado"],
      },
      {
        title:
          "Qual é o modelo do dispositivo (responda ao menos com o nome do fabricante)?",
      },
      {
        title: "O dispositivo é:",
        required: true,
        type: "multiple",
        choices: ["Com fio", "Sem fio"],
      },
      {
        title: "O dispositivo está:",
        required: true,
        type: "multiple",
        choices: [
          "Completamente sem resposta",
          "Funcionalmente de forma inconsistente",
        ],
      },
      {
        title:
          "Caso o dispositivo seja com fio, selecione o formato do conector:",
        type: "dropdown",
        choices: plugTypes,
      },
      {
        title:
          'Caso tenha respondido "Outro" para o formato do conector, detalhe aqui:',
      },
      {
        title: "Caso o dispositivo seja sem fio, selecione o tipo de conexão:",
        type: "dropdown",
        choices: [
          ...btVers,
          "Infravermelho",
          "Li-Fi (Light Fidelity)",
          "Near Field Communication (NFC)",
          "Radio Frequency (RF)",
          "Wi-Fi Direct",
          "Wireless USB",
          "Zigbee",
          "Outros",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha respondido "Outro" para a conexão sem fio, detalhe aqui:',
      },
      {
        title:
          "Caso a falha seja relacionada a teclas específicas, escreva aqui as teclas com falhas:",
        type: "paragraph",
      },
      {
        title: "O sistema operacional detecta o dispositivo de que forma?",
        type: "dropdown",
        choices: [
          "Notificações com janelas",
          "Alertas sonoros",
          "Listagem em gerenciadores de dispositivos",
          "O dispositivo não está sendo detectado pelo Sistema Operacional",
        ],
      },
      {
        title:
          "Você já realizou testes conectando o dispositivo em outros computadores?",
        ...yn,
      },
      {
        title:
          "Caso tenha realizado atualizações recentes no driver do dispositivo, insira aqui a data da última atualização:",
        type: "date",
      },
    ],
  },
  {
    id: "FORM_23",
    fields: [
      device,
      deviceRes,
      {
        title:
          "Qual foi a data (ao menos aproximada) da última utilização do dispositivo?",
        required: true,
        type: "date",
      },
      {
        title:
          "Caso o dispositivo seja uma impressora, qual foi a data (ao menos aproximada) da última limpeza de toners?",
        type: "date",
      },
      {
        title:
          "Caso o dispositivo seja uma impressora, qual foi a data (ao menos aproximada) da última limpeza de cabeçotes da impressora?",
        type: "date",
      },
      {
        title:
          "Caso o dispositivo seja sem fio, assinale qual é o tipo de conexão utilizada:",
        type: "dropdown",
        choices: [
          ...btVers,
          ...wiFiVers,
          "AirPrint",
          "Infravermelho",
          "Li-Fi (Light Fidelity)",
          "Near Field Communication (NFC)",
          "Radio Frequency (RF)",
          "Wi-Fi Direct",
          "Wireless USB",
          "Zigbee",
          "Outro",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha escolhido "Outro" para a conexão sem fio, detalhe aqui:',
      },
      {
        title:
          "Caso o dispositivo seja com fio, assinale qual é o formato do conector para plugar no dispositivo principal:",
        type: "dropdown",
        choices: [
          ...plugTypes,
          "eSATA",
          "Parallel Port (Centronics)",
          "SCSI",
          "Serial Port (RS-232)",
          "Mopria",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha escolhido "Outro" para a conexão sem fio no dispositivo principal, detalhe aqui:',
      },
      {
        title:
          "Caso o dispositivo seja com fio, assinale qual é o formato do conector para plugar no dispositivo de impressão e/ou escaneamento:",
        type: "dropdown",
        choices: [
          ...plugTypes,
          "eSATA",
          "Parallel Port (Centronics)",
          "SCSI",
          "Serial Port (RS-232)",
          "Mopria",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha escolhido "Outro" para a conexão sem fio no dispositivo de impressão e/ou escaneamento, detalhe aqui:',
      },
      {
        title:
          "Caso a conexão seja sem fio, há lentidão notável na resposta do dispositivo para alguns dos comandos desejados? Se sim, aponte qual:",
        type: "checkbox",
        choices: [
          "Impressão",
          "Escaneamento",
          "Limpeza de cabeçote",
          "Cópia",
          "Envio de fax",
          "Transferência de arquivos para o computador",
          "Atualização de firmware",
          "Configuração de rede",
          "Calibração de cores",
          "Alimentação de papel",
          "Troca de cartuchos ou toner",
          "Leitura de cartões de memória (SD, etc.)",
          "Reconhecimento de documentos (OCR)",
          "Impressão duplex (frente e verso)",
          "Escaneamento duplex (frente e verso)",
          "Outro",
        ],
      },
      {
        title:
          "Caso a conexão seja sem fio, há alguma emissão de aviso sobre o estabelecimento da conexão?",
        type: "multiple",
        choices: [
          "Somente no scannear ou impressora",
          "Somente no dispositivo principal",
          "Em ambos os dispositivos",
          "Não há aviso observado",
        ],
      },
      osPciWarn,
      {
        title:
          "Há alguma forma de alerta ou aviso no painel da impressora ou scannear, se o dispositivo possuir um?",
        required: true,
        ...yn_2,
      },
      {
        title:
          "As imagens estão com alguma forma de distorção de gráficos? Caso sim, descreva:",
        type: "paragraph",
      },
      {
        title: "A reprodução da imagem está com listras falhadas?",
        required: true,
        ...yn,
      },
      {
        title: `Caso haja falha nas cores, detalhe aqui quais cores você identifica que estão com resultado inesperado:
        (Você pode organizar em grupo, como: tons de ciano | tons de magenta | tons de amarelo | tons de preto e branco)`,
        type: "paragraph",
      },
      {
        title:
          "Há dano na mídia física utilizada para a saída (ex.: papel), caso haja reprodução em uma? Se sim, descreva:",
        type: "paragraph",
      },
      {
        title: "A velocidade do dispositivo está comprometida?",
        type: yn_2,
      },
      {
        title:
          "Marque aqui outras categorias de falha no processo de impressão, se cabível:",
        type: "checkbox",
        choices: [
          "Falha na alimentação de papel (papel emperra ou não é puxado)",
          "Impressão desalinhada (margens incorretas ou conteúdo fora do lugar)",
          "Impressão fantasma (imagens ou textos repetidos)",
          "Manchas de tinta ou toner na página",
          "Impressão muito clara ou desbotada",
          "Impressão muito escura ou com excesso de tinta/toner",
          "Linhas horizontais ou verticais na impressão",
          "Ruídos excessivos durante a impressão",
          "Falha na duplexação (impressão frente e verso)",
          "Falha na impressão de códigos de barras ou QR codes",
          "Impressão de páginas em branco",
          "Impressão de páginas com conteúdo parcial ou cortado",
          "Problemas com o cartucho de tinta ou toner (ex.: vazamentos, baixa qualidade)",
          "Falha no reconhecimento de cores (ex.: preto e branco em vez de colorido)",
          "Falha na calibração das cores",
        ],
      },
      {
        title:
          "Marque aqui outras categorias de falha no processo de escaneamento, se cabível:",
        type: "checkbox",
        choices: [
          "Falha na alimentação de papel (papel emperra ou não é puxado)",
          "Imagem escaneada desfocada ou borrada",
          "Imagem escaneada com cores distorcidas",
          "Falha no reconhecimento de texto (OCR)",
          "Documento escaneado cortado ou incompleto",
          "Ruídos excessivos durante o escaneamento",
          "Falha na duplexação (escaneamento frente e verso)",
          "Falha no alinhamento do documento (margens incorretas)",
          "Imagem escaneada muito clara ou desbotada",
          "Imagem escaneada muito escura ou com sombras",
          "Falha no reconhecimento de cores (ex.: preto e branco em vez de colorido)",
          "Problemas com o sensor de imagem do scanner",
          "Falha na calibração das cores",
        ],
      },
      {
        title:
          "Se você considera que seu problema não foi categorizado corretamente, aponte aqui:",
        type: "paragraph",
      },
      ...os,
      driverUpdate,
    ],
  },
  {
    id: "FORM_24",
    fields: [
      device,
      deviceRes,
      {
        title:
          "Caso o dispositivo seja sem fio, assinale qual é o tipo de conexão utilizada:",
        type: "dropdown",
        choices: [
          ...btVers,
          ...wiFiVers,
          "AirPrint",
          "Infravermelho",
          "Li-Fi (Light Fidelity)",
          "Near Field Communication (NFC)",
          "Radio Frequency (RF)",
          "Wi-Fi Direct",
          "Wireless USB",
          "Zigbee",
          "Outro",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha escolhido "Outro" para a conexão sem fio, detalhe aqui:',
      },
      {
        title:
          "Caso o dispositivo seja com fio, assinale qual é o formato do conector para plugar no dispositivo principal:",
        type: "dropdown",
        choices: [
          ...plugTypes,
          "Parallel Port (Centronics)",
          "Serial Port (RS-232)",
          "Ethernet (RJ45)",
          "FireWire (IEEE 1394)",
          "SCSI",
          "eSATA",
          "Proprietary Connectors",
          "USB On-The-Go (OTG)",
          "SD Card Slot",
          "PictBridge",
          "AirPrint (Apple)",
          "Mopria",
        ].sort((a, b) => a.localeCompare(b)),
      },
      {
        title:
          'Caso tenha escolhido "Outro" para a conexão sem fio no dispositivo principal, detalhe aqui:',
        type: "text",
      },
      {
        title:
          "Caso o dispositivo seja com fio, assinale qual é o formato do conector para plugar no dispositivo de áudio:",
        type: "dropdown",
        choices: [
          ...plugTypes,
          "Parallel Port (Centronics)",
          "Serial Port (RS-232)",
          "Ethernet (RJ45)",
          "FireWire (IEEE 1394)",
          "SCSI",
          "eSATA",
          "Proprietary Connectors",
          "USB On-The-Go (OTG)",
          "SD Card Slot",
          "PictBridge",
          "Mopria",
        ]
          .sort((a, b) => a.localeCompare(b))
          .reduce((ac, it) => {
            if (
              /^(?:não\s+reconhe[çc]o\s+nenhum\s+dos\s+formatos?|outro|propriet[áa]rio)/i.test(
                it
              )
            )
              ac.push(it);
            else ac.unshift(it);
            return ac;
          }, [])
          .filter((item, index, array) => array.indexOf(item) === index)
          .filter(Boolean),
      },
      {
        title:
          "Escolha quais categorias de problemas se encaixam no quadro de problemas do seu dispositivo:",
        type: "checkbox",
        required: true,
        choices: [
          "Sem áudio na saída",
          "Áudio distorcido/embaralhado",
          "Eco no áudio",
          "Volume muito baixo",
          "Cortes intermitentes de áudio",
          "Ruído de fundo excessivo",
          "Latência no áudio (atraso)",
          "Microfone não detectado",
          "Áudio unilateral (apenas um lado funciona)",
          "Voz robótica ou digitalizada",
          "Incompatibilidade de codec de áudio",
          "Problemas de driver de áudio",
          "Falha de hardware (ex: alto-falante quebrado)",
          "Outro",
        ]
          .sort((a, b) => a.localeCompare(b))
          .reduce((ac, it) => {
            if (
              /^(?:não\s+reconhe[çc]o\s+nenhum\s+dos\s+formatos?|outro|propriet[áa]rio)/i.test(
                it
              )
            )
              ac.push(it);
            else ac.unshift(it);
            return ac;
          }, [])
          .filter((item, index, array) => array.indexOf(item) === index)
          .filter(Boolean),
      },
      {
        title:
          "Há alguma forma de dano físico notável no dispositivo? Se sim, escolha dentre as opções:",
        type: "checkbox",
        choices: [
          "Conector danificado",
          "Amassados ou deformações no corpo do dispositivo",
          "Superfície riscada ou desgastada",
          "Botões ou controles não funcionando",
          "Indicadores de luz não funcionando",
          "Ruídos estranhos ao mover o dispositivo",
          "Cheiro de queimado",
          "Outro",
        ]
          .sort((a, b) => a.localeCompare(b))
          .reduce((ac, it) => {
            if (
              /^(?:não\s+reconhe[çc]o\s+nenhum\s+dos\s+formatos?|outro|propriet[áa]rio)/i.test(
                it
              )
            )
              ac.push(it);
            else ac.unshift(it);
            return ac;
          }, [])
          .filter((item, index, array) => array.indexOf(item) === index)
          .filter(Boolean),
      },
      ...os,
      osPciWarn,
      driverUpdate,
    ],
  },
];
const timer = 10000;
if (mainList.length > 1) {
  Logger.log(
    `Wait! There are more than one id being worked on. Abort the execution within ${
      timer * 0.001
    } seconds if this is not intentional`
  );
  Utilities.sleep(timer + 500);
}
Logger.log("Beginning execution...");
mainList.forEach(({ id, fields }) => {
  addQuestions(id, fields);
});
Logger.log("Finished execution");
