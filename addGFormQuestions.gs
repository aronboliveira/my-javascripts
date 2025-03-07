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
    else if (title?.trim().toLowerCase().match(/^\s*Contato\s*(e\-?mail\s*ou\s*telefone)\s*$/i)) foundBasicFields.contact = true;
    const found = form.getItems().findIndex(item => item?.getTitle()?.toLowerCase().trim() === title?.toLowerCase().trim());
    found && found !== -1 && !['Avalie sua satisfação com este formulário!', 'Envie aqui anexos para o diagnóstico, caso queira:', 'Caso haja uma mensagem de erro em tela, escreva a mesma aqui:'].some(t => t === li.getTitle()) && form.deleteItem(li.getIndex());
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
};
[
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
  }
].forEach(({id, fields}) => {
  addQuestions(id, fields);
})
