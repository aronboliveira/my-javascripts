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
  }
  for (let i = 0; i < form.getItems().length; i++) {
    const li = form.getItems()[i],
    title = li.getTitle();
    if (title?.trim().toLowerCase() === 'nome') foundBasicFields.name = true;
    if (title?.trim().toLowerCase().match(/^\s*Contato\s*\(e\-?mail\s*ou\s*telefone\)\s*$/i)) foundBasicFields.contact = true;
    const found = form.getItems().findIndex(item => item?.getTitle()?.toLowerCase().trim() === title?.toLowerCase().trim());
    found && found !== -1 && 
      !['Avalie sua satisfação com este formulário!', 'Envie aqui anexos para o diagnóstico, caso queira:', 'Caso haja uma mensagem de erro em tela, escreva a mesma aqui:']
        .some(t => t === li.    getTitle()) 
          && form.deleteItem(li.getIndex());
    switch (title) {
      case 'Avalie sua satisfação com este formulário!':
        lastItems.push(li);
        indexes.eval = 1;
        break;
      case 'Envie aqui anexos para o diagnóstico, caso queira:':
        lastItems.unshift(li);
        indexes.attach = 1 + (indexes.eval ?? 0);
        break;
      case 'Caso haja uma mensagem de erro em tela, escreva a mesma aqui:':
        lastItems.unshift(li);
        indexes.attach = 1 + (indexes.eval ?? 0) + (indexes.error ?? 0);
        break;
      default:
        break;
    };  
  }
  if (!foundBasicFields.name) {
    const n = form.addTextItem().setTitle('Nome').setRequired(true);
    form.moveItem(n.getIndex(), 0);
    foundBasicFields.name = true;
  }
  if (!foundBasicFields.contact) {
    const c = form.addTextItem().setTitle('Contato (e-mail ou telefone)').setRequired(true);
    form.moveItem(c.getIndex(), 1);
    foundBasicFields.contact = true;
  }
  for (const field of fields) {
    if (form.getItems().some(it => it.getTitle()?.trim().toLowerCase() === field.title?.trim().toLowerCase())) continue;
    switch (field.type) {
      case 'paragraph':
        form.addParagraphTextItem()
          .setTitle(field.title || 'No title was given')
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'multiple':
        form.addMultipleChoiceItem()
          .setTitle(field.title || 'No title was given')
          .setChoiceValues(field.choices || [])
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'checkbox':
        form.addCheckboxItem()
          .setTitle(field.title || 'No title was given')
          .setChoiceValues(field.choices || [])
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'dropdown':
        form.addListItem()
          .setTitle(field.title || 'No title was given')
          .setChoiceValues(field.choices || [])
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'scale':
        form.addScaleItem()
          .setTitle(field.title || 'No title was given')
          .setBounds(field.lowerBound || 1, field.upperBound || 5)
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'date':
        form.addDateItem()
          .setTitle(field.title || 'No title was given')
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'time':
        form.addTimeItem()
          .setTitle(field.title || 'No title was given')
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'checkboxGrid':
        form.addCheckboxGridItem()
          .setTitle(field.title || 'No title was given')
          .setRows(field.choices || [])
          .setColumns(field.choices || [])
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'grid':
        form.addGridItem()
          .setTitle(field.title || 'No title was given')
          .setRows(field.choices || [])
          .setColumns(field.choices || [])
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'file':
        form.addFileUploadItem()
          .setTitle(field.title || 'No title was given')
          .setRequired(field.required || false)
          .setHelpText(field.helpText || '');
        break;
      case 'section':
        form.addSectionHeaderItem()
          .setTitle(field.title || 'No title was given')
          .setHelpText(field.helpText || '');
        break;
      case 'break':
        form.addPageBreakItem()
          .setTitle(field.title || 'No title was given')
          .setHelpText(field.helpText || '');
        break;
      case 'image':
        form.addImageItem()
          .setTitle(field.title || 'No title was given')
          .setHelpText(field.helpText || '');
        break;
      case 'video':
        form.addVideoItem()
          .setTitle(field.title || 'No title was given')
          .setVideoUrl(field.url || '')
          .setHelpText(field.helpText || '');
        break;
      default:
        form.addTextItem()
          .setTitle(field.title || 'No title was given')
          .setRequired(field.required || false).setHelpText(field.setHelpText || '');
    }
  }
  for (let i = 0; i < lastItems.length; i++) {
    const li = lastItems[i],
    index = li.getIndex();
    switch (li.getTitle()) {
      case 'Avalie sua satisfação com este formulário!':
        form.moveItem(index, form.getItems().length - 1);
        break;
      case 'Envie aqui anexos para o diagnóstico, caso queira:':
        form.moveItem(index, form.getItems().length - (indexes.eval ? 1 : 0));
        break;
      case 'Caso haja uma mensagem de erro em tela, escreva a mesma aqui:':
        form.moveItem(index, form.getItems().length - (indexes.eval ? 1 :0) - (indexes.attach ? 1 : 0));
        break;
      default:
        continue;
    }
  }
  } catch (e) {
    Logger.log(`Failed to execute addQuestions at ${new Date()}: ${e.name} — ${e.message}`)
  }
}
const os = [
  {
    title: "Qual é o Sistema Operacional usado?",
    type: "dropdown",
    choices: [...['10', '11', '8', 'anterior ao 8'].map(w => `Windows ${w}`), 'Distribuição Linux', 'macOS', 'Android', 'iOS', 'Outros', 'Não sei responder']
  },
  {
    title: 'Caso tenha escolhido "Outros" ou "Distribuição Linux" na opção anterior, por favor detalhar:',
    type: "text",
  },
  {
    title: 'Caso tenha escolhido "macOS", "Android" ou "iOS", por favor inserir a versão aqui:',
    type: "text"
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
      "Yandex Browser"
    ]
  }
],
yn = {
  type: 'multiple',
  choices: ["Sim", "Não"]
},
contactApp = {
  title: "Nome do Serviço ou Aplicativo utilizado (ex.: Gmail, Outlook, Salesforce, VPN Corporativa, etc.):",
  required: true
},
device = {
  title: "Modelo do Dispositivo utilizado:",
},
sharing = {
  type: "multiple",
  choices: ["Corporativa", "Pessoal"]
},
contractStart = [
  {
    title: "CPF ou CNPJ do titular do contrato",
    required: true
  },
  {
    title: "Qual é o tipo de contrato que você deseja iniciar?",
    type: "multiple",
    choices: ["Prestação de Serviço", "Mensal"],
    required: true
  },
  {
    title: "Qual é a duração desejada do contrato, caso seja mensal?"
  },
  {
    title: "Quais são as formas de pagamento a serem sugeridas?"
  },
  {
    title: "Use este espaço para incluir necessidade específicas a serem incluídas (ex.: cláusulas personalizadas, formas de pagamento diferenciadas)",
    type: "paragraph"
  }
],
mailDirs = [
  {
    title: "Pastas da caixa de e-mail afetada (principal, social, customizadas, etc.)"
  }
],
nwType = {
  title: "Qual é o tipo de rede que você estava utilizando durante a chamada?",
  type: "dropdown",
  choices: [
  ...["Wi-Fi 4", "Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"]
    .flatMap(g => [
      ...(g.includes("4") || g.includes("7") || (g.includes("6") && !g.endsWith("E"))) ? [`${g} - 2.4 GHz`] : [], 
      ...(!g.includes("6E") ? [`${g} - 5 GHz`] : []), 
      ...(g.includes("6E") ? [`${g} - 6 GHz`] : []),
      ...(g.includes("7") ? [`${g} - 6 GHz`, `${g} - Multi-Link`] : [])
    ]),
    ...["5G", "4G","3G", "2G","LTE"].map(g => `Rede Móvel ${g}`),
    "Ethernet",
    "Bluetooth",
    "VPN",
    "Satélite",
    "Dial-Up",
    "Rede Mesh",
    "Ponto de Acesso Móvel"
  ],
},
audioErrors = {
  title: "Quais destes tópicos você consegue identificar que têm relação com o seu problema na Tranmissão de áudio?",
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
    "Falha de hardware (ex: alto-falante quebrado)"
  ]
},
videoErrors = {
  title: "Quais destes tópicos você consegue identificar que têm relação com o seu problema na Transmissão de vídeo?",
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
    "Falha de hardware (ex: câmera danificada)"
  ]
},
teleComCompanies = [
  {
    title: "Qual era a operadora de Telecomunicação no dispositivo em que você fez a chamada?",
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
      "Outra"
    ],
    required: true
  },
  {
    title: 'Se você escolheu "Outra" na operação anterior, detalhe aqui:'
  }
];
const mainList = [
  {
    id: 'FORM_1', 
    fields: [
      ...os,
      ...bwr,
      {
        title: "Você recebeu um e-mail para resetar a sua senha?",
        ...yn
      },
      contactApp
    ]
  },
  {
    id: "FORM_2",
    fields: [
      device,
      ...os,
      ...bwr,
      contactApp,
      {
        title: "Se a sua conexão utiliza VPN, escolha se esta é corporativa ou pessoal:",
        ...sharing
      },
      {
        title: "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
        ...sharing
      },
      {
        title: "Quantas tentativas de acesso já foram feitas?"
      },
      {
        title: "Data do bloqueio:",
        type: "date"
      },
      {
        title: "Horário (estimado ou exato) do bloqueio:",
        type: "time"
      }
    ]
  },
  {
    id: "FORM_3",
    fields: [
      ...os,
      ...bwr,
      contactApp,
      {
        title: "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
        ...sharing
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
          "FIDO2 Security Key"
        ]
      },
      {
        title: "Existem códigos de Backup?",
        type: "multiple",
        ...yn
      }
    ]
  },
  {
   id: "FORM_4",
   fields: [
    ...bwr,
    device,
    contactApp,
    {
      title: "Você já tentou limpar cookies e/ou cache no Aplicativo e/ou o Serviço usado?",
      ...yn
    },
    {
      title: "Nome do provedor de SSO, se tiver acesso",
    },
    {
      title: "A tentativa de acesso foi em uma rede comportilhada ou pessoal?",
      ...sharing
    },
    {
      title: "Existem códigos de Backup?",
      type: "multiple",
      ...yn
    }
   ] 
  },
  {
    id: "FORM_5",
    fields: [
      ...bwr,
      device,
      contactApp,
      {
        title: "Quantas tentativas de reconfiguração já houveram?"
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
          "Reconhecimento de DNA"
        ]
      }
    ]
  },
  {
    id: "FORM_6",
    fields: [
      {
        title: "Você precisa cadastrar, atualizar ou recuperar informações?",
        tipe: "multiple",
        choices: ["Cadastrar", "Atualizar", "Recuperar"]
      },
      {
        title: "O problema envolve relacionamento com clientes, suporte após prestação de serviço ou suporte contratual?",
        type: "multiple",
        choices: ["Relacionamento com clientes", "Suporte após prestação de Serviço", "Suporte Contratual"]
      },
      {
        title: "Existe necessidade de expansão da rede de representantes ou parceiros?",
        ...yn
      }
    ]
  },
  {
    id: "FORM_7",
    fields: [
      ...contractStart
    ]
  },
  {
    id: "FORM_8",
    fields: [
      {
        title: "Qual é o número ou identificação do contrato que deseja alterar?",
        required: true,
      },
      {
        title: "Qual tipo de alteração é necessária?",
        type: "paragraph",
        required: true
      },
    ]
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
          "Outro motivo"
        ]
      },
      {
        title: 'Caso tenha escolhido "Outros" na opção anterior, detalhe aqui:',
      },
      {
        title: "Você já está ciente de possíveis quebras de cláusulas de fidelidade ou multas por rescisão antecipada?",
        required: true,
        ...yn
      },
      {
        title: "Você deseja negociar valores pendentes?",
        required: true,
        ...yn
      },
      {
        title: "Use este espaço livremente para deixar feedbacks sobre o serviço, experiências e suas motivações",
        type: "paragraph"
      }
    ]
  },
  {
    id: "FORM_10",
    fields: [
      ...os,
      {
        title: "Nome específico (ou indicativo) da configuração defeituosa ou em necessidade de ajuste",
        required: true,
        type: 'paragraph'
      }
    ]
  },
  {
    id: "FORM_11",
    fields: [
      {
        title: "Nome da Configuração, Recurso ou Ferramenta que deseja ajustar",
        required: true
      },
      ...bwr,
    ]
  },
  {
    id: "FORM_12",
    fields: [
      ...bwr,
      ...mailDirs,
      {
        title: 'Dados sobre frequência de sincronização (procure alguma informação como "Última sincronização" nas mensagens ou configuração do seu aplicativo)',
        required: true,
        type: "paragraph"
      },
    ]
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
        title: "Corpo e cabeçalho do e-mail (não copie e cole, envie prints ou descreva)",
        type: 'paragraph'
      },
      {
        title: "Assinatura do e-mail",
      },
      {
        title: "Quais categorias de dados comprometedores sobre você ou a sua empresa o e-mail apresenta?",
        required: true
      },
      {
        title: "O agressor apresentou algum tipo de evidência factível sobre suas atividades recentes?",
        required: true,
        ...yn
      },
      {
        title: 'O agressor apresentou alguma forma de apresentação explícita (ex.: "Sou um hacker!")',
        required: true,
        ...yn
      },
      {
        title: "Foi feita alguma forma de tentativa de extorção na mensagem?",
        required: true,
        ...yn
      },
      {
        title: "O agressor o/a contatou ou afetou de alguma maneira que não seja o e-mail em questão?",
        required: true,
        ...yn
      },
      {
        title: "Você respondeu ao agressor de alguma forma?",
        required: true,
        ...yn
      },
      {
        title: "Se sim para o último caso, por favor detalhe aqui:",
        type: "paragraph"
      },
      {
        title: "Você acessou algum hyperlink ou baixou algum arquivo apresentado pelo agressor?",
        required: true,
        ...yn
      },
      {
        title: "Se sim para o último caso, detalhe (sem enviar os links e/ou arquivos relacionados)",
        type: "paragraph"
      },
      {
        title: "Você reconhece de alguma forma algum dos dados do agressor (endereço, nome, etc.)?",
        required: true,
        ...yn
      }
    ]
  },
  {
    id: "FORM_14",
    fields: [
      device,
      ...os,
      ...bwr,
      nwType,
      audioErrors,
      videoErrors
    ]
  },
  {
    id: "FORM_15",
    fields: [
      device,
      ...os,
      ...bwr,
      nwType,
      audioErrors
    ]
  },
  {
    id: "FORM_16",
    fields: [
      device,
      audioErrors,
      ...teleComCompanies
    ]
  },
 {
    id: "FORM_17",
    fields: [
      ...os,
      ...bwr,
      {
        title: "Caso seja uma ou algumas das ferramentas especificamente causando problemas, relate aqui:",
        type: "paragraph"
      },
      {
        title: "Qual era o número aproximado de abas abertas durante os momentos de falha?",
        type: "dropdown",
        choices: ["1", "2 a 5", "5 a 10", "10 a 20", "mais de 20"]
      },
      {
        title: "Sobre o seu carregamento, as páginas:",
        type: "multiple",
        choices: ["Não carregam", "Carregam parcialmente", "Carregam de forma inesperada, com inconsistências visuais e bugs", "Carregam sem Problemas"]
      },
      {
        title: "Nos casos críticos, o navegador:",
        required: true,
        type: "multiple",
        choices: ["Colapsa completamente e interrompe o seu processo", "se mantém ativo mesmo que de forma muito prejudicada"]
      },
      {
        title: "Você já testou alterações na otimização gráficas da configuração do navegador?",
        ...yn
      },
      {
        title: "Você já realizou testes similares em outros navegadores?",
        ...yn
      },
      {
        title: "Assinale extensões que você utiliza no seu navegador:",
        type: "checkbox",
        choices: ["AdBlock", "Grammarly", "LastPass", "Dark Reader", "uBlock Origin", "Privacy Badger", "HTTPS Everywhere", "Tree Style Tab","Microsoft Editor", "Pinterest Save Button", "Amazon Assistant", "Evernote Web Clipper", "1Password", "Honey", "Momentum", "Ghostery", "Wappanalyzer"]
      },
      {
        title: "Caso utilize outras extensões e/ou plugins, liste aqui:",
        type: "paragraph"
      },
      {
        title: "Você utilizou o Console do navegador de alguma forma?\n\nO mesmo é aberto com Inspecionador (F12) + aba Console",
        type: "multiple",
        choices: ["Sim", "Não", "Não tenho certeza"]
      },
      {
        title: `Caso possível, envie-nos mensagens de Erro no console escrevendo aqui ou deixando como um print (tecla Print Screen) anexado.

Para acessar:

1. Clique com o botão direito em um espaço vazio da página + Inspecionar (ou somente aperte F12 na maioria dos navegadores e páginas);
2. Vá na aba Console no cabeçalho da divisória aberta e clique;
3. Na subdivisória ao lado esquerdo da mesma divisória anterior, clique em "Erros" ou "Errors". O mesmo título conterá uma contagem antecedendo.`,
        type: "paragraph"
      }
    ]
  },
  {
    id: "FORM_18",
    fields: [
      {
        name: "Escolha qual destas classes de problemas está mais bem relacionada à sua questão",
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
  }
].
const timer = 10000;
if (mainList.length > 1) {
  Logger.log(`Wait! There are more than one id being worked on. Abort the execution within ${timer * 0.001} seconds if this is not intentional`);
  Utilities.sleep(timer + 500);
}
Logger.log("Beginning execution...")
mainList.forEach(({id, fields}) => {
  addQuestions(id, fields);
});
Logger.log("Finished execution")
