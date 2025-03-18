import {
  HTTPResponseClientErrorLabelEn,
  HTTPResponseClientErrorLabelPt,
  HTTPResponseInfoLabelEn,
  HTTPResponseInfoLabelPt,
  HTTPResponseRedirectLabelEn,
  HTTPResponseRedirectLabelPt,
  HTTPResponseServerErrorLabelEn,
  HTTPResponseServerErrorLabelPt,
  HTTPResponseSuccessfulLabelEn,
  HTTPResponseSuccessfulLabelPt,
  HTTPReturns,
  PseudoNum,
  ResponseLanguage,
} from "../foundations";
import ObjectHelper from "../utils/ObjectHelper";
export const patterns: Readonly<{
  email: string;
  countryCode: string;
  ddd: string;
  age: string;
  internationalTel: RegExp;
}> = Object.freeze({
  email: `^[^\s@]+@[^\s@]+\.[^\s@]+$`,
  countryCode: "^\\+[0-9]{2,4}s?$",
  ddd: `^[0-9]{2,}$`,
  age: `^[0-9]{1,3}$`,
  internationalTel: /^[0-9()\-\s+]{1,20}$/,
});
export const limits: Readonly<{
  tiny: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  small: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  medium: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  large: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  huge: {
    MAX_UTF16_SIGNED_SURROGATE: number;
    MAX_UTF16_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_SIGNED_SURROGATE: () => number;
    MAX_UTF8_SIGNED_NOTSURROGATE: () => number;
    MAX_UTF16_UNSIGNED_SURROGATE: () => number;
    MAX_UTF16_UNSIGNED_NOTSURROGATE: () => number;
    MAX_UTF8_UNSIGNED_SURROGATE: () => number;
    MAX_UTF8_UNSIGNED_NOTSURROGATE: () => number;
  };
  services: {
    MAX_REQUEST_TIMER: number;
    MAX_SERVICE_TIMER: () => number;
  };
}> = ObjectHelper.deepFreeze({
  tiny: {
    MAX_UTF16_SIGNED_SURROGATE: 63,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  small: {
    MAX_UTF16_SIGNED_SURROGATE: 16383,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  medium: {
    MAX_UTF16_SIGNED_SURROGATE: 4194303,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  large: {
    MAX_UTF16_SIGNED_SURROGATE: 1073741823,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  huge: {
    MAX_UTF16_SIGNED_SURROGATE: 274877906943,
    MAX_UTF16_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF8_SIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF16_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 2);
    },
    MAX_UTF16_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_SURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 4);
    },
    MAX_UTF8_UNSIGNED_NOTSURROGATE: function (): number {
      return Math.floor(this.MAX_UTF16_SIGNED_SURROGATE * 8);
    },
  },
  services: {
    MAX_REQUEST_TIMER: 60000,
    MAX_SERVICE_TIMER: function (): number {
      return this.MAX_REQUEST_TIMER * 5;
    },
  },
});
export const HTTPResInfoMap = new Map<
  number,
  ResponseLanguage<HTTPResponseInfoLabelPt, HTTPResponseInfoLabelEn>
>([
  [100, { en: "Continue", pt: "Continuar" }],
  [
    101,
    {
      en: "Switching Protocols",
      pt: "Trocando Protocolos",
    },
  ],
  [102, { en: "Processing", pt: "Processando" }],
  [103, { en: "Early Hints", pt: "Primeiras Dicas" }],
]);
export const HTTPResSuccessfulMap: Readonly<
  Map<
    number,
    ResponseLanguage<
      HTTPResponseSuccessfulLabelPt,
      HTTPResponseSuccessfulLabelEn
    >
  >
> = ObjectHelper.deepFreeze(
  new Map<
    number,
    ResponseLanguage<
      HTTPResponseSuccessfulLabelPt,
      HTTPResponseSuccessfulLabelEn
    >
  >([
    [200, { en: "OK", pt: "Tudo Certo" }],
    [201, { en: "Created", pt: "Criado" }],
    [202, { en: "Accepted", pt: "Aceito" }],
    [
      203,
      {
        en: "Non-Authoritative Information",
        pt: "Informações Não-Autoritativas",
      },
    ],
    [204, { en: "No Content", pt: "Sem Conteúdo" }],
    [205, { en: "Reset Content", pt: "Redefinir Conteúdo" }],
    [206, { en: "Partial Content", pt: "Conteúdo Parcial" }],
    [207, { en: "Multi-Status", pt: "Status Múltiplo" }],
    [208, { en: "Already Reported", pt: "Já Reportado" }],
    [226, { en: "IM Used", pt: "IM Usado" }],
  ])
);
export const HTTPResRedirectMap: Readonly<
  Map<
    number,
    ResponseLanguage<HTTPResponseRedirectLabelPt, HTTPResponseRedirectLabelEn>
  >
> = ObjectHelper.deepFreeze(
  new Map<
    number,
    ResponseLanguage<HTTPResponseRedirectLabelPt, HTTPResponseRedirectLabelEn>
  >([
    [300, { en: "Multiple Choices", pt: "Múltiplas Escolhas" }],
    [
      301,
      {
        en: "Moved Permanently",
        pt: "Movido Permanentemente",
      },
    ],
    [302, { en: "Found", pt: "Encontrado" }],
    [303, { en: "See Other", pt: "Ver Outro" }],
    [304, { en: "Not Modified", pt: "Não Modificado" }],
    [306, { en: "Unused", pt: "Não Usado" }],
    [
      307,
      {
        en: "Temporary Redirect",
        pt: "Redirecionamento Temporário",
      },
    ],
    [
      308,
      {
        en: "Permanent Redirect",
        pt: "Redirecionamento Permanente",
      },
    ],
  ])
);
export const HTTPResClientErrorMap: Readonly<
  Map<
    number,
    ResponseLanguage<
      HTTPResponseClientErrorLabelPt,
      HTTPResponseClientErrorLabelEn
    >
  >
> = ObjectHelper.deepFreeze(
  new Map<
    number,
    ResponseLanguage<
      HTTPResponseClientErrorLabelPt,
      HTTPResponseClientErrorLabelEn
    >
  >([
    [400, { en: "Bad Request", pt: "Requisição Inválida" }],
    [401, { en: "Unauthorized", pt: "Não Autorizado" }],
    [
      402,
      {
        en: "Payment Required",
        pt: "Pagamento Necessário",
      },
    ],
    [403, { en: "Forbidden", pt: "Proibido" }],
    [
      404,
      {
        en: "Resource Not Found",
        pt: "Recurso não encontrado",
      },
    ],
    [
      405,
      {
        en: "Method Not Allowed",
        pt: "Método Não Permitido",
      },
    ],
    [406, { en: "Not Acceptable", pt: "Não Aceitável" }],
    [
      407,
      {
        en: "Proxy Authentication Required",
        pt: "Autenticação de Proxy Necessária",
      },
    ],
    [
      408,
      {
        en: "Request Timeout",
        pt: "Tempo Limite da Requisição",
      },
    ],
    [409, { en: "Conflict", pt: "Conflito" }],
    [410, { en: "Gone", pt: "Perdido" }],
    [
      411,
      {
        en: "Length Required",
        pt: "Comprimento Necessário",
      },
    ],
    [
      412,
      {
        en: "Preconditional Failed",
        pt: "Pré-condição Falhou",
      },
    ],
    [
      413,
      {
        en: "Content Too Large",
        pt: "Conteúdo Muito Grande",
      },
    ],
    [414, { en: "URI Too Long", pt: "URI Muito Longo" }],
    [
      415,
      {
        en: "Unsupported Media Type",
        pt: "Tipo de Mídia Não Suportado",
      },
    ],
    [
      416,
      {
        en: "Range Not Satisfiable",
        pt: "Intervalo Não Satisfatório",
      },
    ],
    [
      417,
      {
        en: "Expectation Failed",
        pt: "Expectativa Falhou",
      },
    ],
    [418, { en: "I'm a teapot", pt: "Eu sou um bule" }],
    [
      421,
      {
        en: "Misdirected Request",
        pt: "Requisição Mal Direcionada",
      },
    ],
    [
      422,
      {
        en: "Unprocessable Content",
        pt: "Conteúdo Não Processável",
      },
    ],
    [423, { en: "Locked", pt: "Bloqueado" }],
    [424, { en: "Failed Dependency", pt: "Dependência Falhou" }],
    [425, { en: "Too Early", pt: "Muito Cedo" }],
    [
      426,
      {
        en: "Upgrade Required",
        pt: "Atualização Necessária",
      },
    ],
    [
      428,
      {
        en: "Precondition Required",
        pt: "Pré-condição Necessária",
      },
    ],
    [429, { en: "Too Many Requests", pt: "Muitas Requisições" }],
    [
      431,
      {
        en: "Request Header Fields Too Large",
        pt: "Campos do Cabeçalho da Requisição Muito Grandes",
      },
    ],
    [
      451,
      {
        en: "Unavailable For Legal Reasons",
        pt: "Indisponível por Motivos Legais",
      },
    ],
  ])
);
export const HTTPResServerErrorMap: Readonly<
  Map<
    number,
    ResponseLanguage<
      HTTPResponseServerErrorLabelPt,
      HTTPResponseServerErrorLabelEn
    >
  >
> = ObjectHelper.deepFreeze(
  new Map<
    number,
    ResponseLanguage<
      HTTPResponseServerErrorLabelPt,
      HTTPResponseServerErrorLabelEn
    >
  >([
    [
      500,
      {
        en: "Internal Server Error",
        pt: "Erro Interno do Servidor",
      },
    ],
    [501, { en: "Not Implemented", pt: "Não Implementado" }],
    [502, { en: "Bad Gateway", pt: "Gateway Inválido" }],
    [
      503,
      {
        en: "Service Unavailable",
        pt: "Serviço Indisponível",
      },
    ],
    [
      504,
      {
        en: "Gateway Timeout",
        pt: "Tempo Limite do Gateway",
      },
    ],
    [
      505,
      {
        en: "HTTP Version Not Supported",
        pt: "Versão HTTP Não Suportada",
      },
    ],
    [
      506,
      {
        en: "Variant Also Negotiates",
        pt: "Variante Também Negocia",
      },
    ],
    [
      507,
      {
        en: "Insufficient Storage",
        pt: "Armazenamento Insuficiente",
      },
    ],
    [508, { en: "Loop Detected", pt: "Loop Detectado" }],
    [510, { en: "Not Extended", pt: "Não Estendido" }],
    [
      511,
      {
        en: "Network Authentication Required",
        pt: "Autenticação de Rede Necessária",
      },
    ],
  ])
);
export const HTTPRes: Readonly<{
  [K in HTTPReturns]:
    | typeof HTTPResInfoMap
    | typeof HTTPResSuccessfulMap
    | typeof HTTPResRedirectMap
    | typeof HTTPResClientErrorMap
    | typeof HTTPResServerErrorMap;
}> = ObjectHelper.deepFreeze({
  info: HTTPResInfoMap,
  successful: HTTPResSuccessfulMap,
  redirect: HTTPResRedirectMap,
  clientError: HTTPResClientErrorMap,
  serverError: HTTPResServerErrorMap,
});
export const StartingHTTPDigits: Readonly<{
  [k: PseudoNum]: HTTPReturns;
}> = Object.freeze({
  "0": "serverError",
  "1": "info",
  "2": "successful",
  "3": "redirect",
  "4": "clientError",
  "5": "serverError",
  "6": "serverError",
  "7": "serverError",
  "8": "serverError",
  "9": "serverError",
});
export enum HTTPReturnsFriendlyEn {
  i = "Information",
  s = "Successful",
  r = "Redirection",
  se = "Server Error",
  ce = "Client Error",
}
export enum HTTPReturnsFriendlyPt {
  i = "Informação",
  s = "Sucesso",
  r = "Redireção",
  se = "Erro no Servidor",
  ce = "Erro no Cliente",
}
export const URLData = {
  subdomain: "test-url",
};
export const jsErrorsFriendlyNames: Readonly<{
  [k: string]: Map<string, string>;
}> = ObjectHelper.makeImmutable({
  EN: new Map<string, string>([
    ["TypeError", "Type Error"],
    ["SyntaxError", "Syntax Error"],
    ["ReferenceError", "Reference Error"],
    ["RangeError", "Range Error"],
    ["URIError", "URI Error"],
    ["IndexSizeError", "Index Size Error"],
    ["HierarchyRequestError", "Hierarchy Request Error"],
    ["EncodingError", "Encoding Error"],
    ["NamespaceError", "Namespace Error"],
    ["SyntaxError", "Syntax Error"],
    ["SecurityError", "Security Error"],
    ["InvalidAccessError", "Invalid Access Error"],
    ["WrongDocumentError", "Wrong Document Error"],
    ["NotFoundError", "Not Found Error"],
    ["NetworkError", "Network Error"],
    ["URLMismatchError", "URL Mismatch Error"],
    ["TransactionInactiveError", "Transaction Inactive Error"],
    ["QuotaExceededError", "Quota Exceeded Error"],
    ["TimeoutError", "Timeout Error"],
    ["AbortError", "Abort Error"],
    ["VersionError", "Version Error"],
    ["NotSupportedError", "Not Supported Error"],
    ["InvalidStateError", "Invalid State Error"],
    ["InvalidModificationError", "Invalid Modification Error"],
    ["InvalidCharacterError", "Invalid Character Error"],
    ["TypeMismatchError", "Type Mismatch Error"],
    ["DataCloneError", "Data Clone Error"],
    ["NotReadableError", "Not Readable Error"],
    ["ConstraintError", "Constraint Error"],
    ["ReadOnlyError", "Read Only Error"],
    ["OperationError", "Operation Error"],
    ["UnknownError", "Unknown Error"],
    ["InternalError", "Internal Error"],
    ["UnhandledException", "Unhandled Exception"],
  ]),
  PT: new Map<string, string>([
    ["TypeError", "Erro de Tipo"],
    ["SyntaxError", "Erro de Sintaxe"],
    ["ReferenceError", "Erro de Referência"],
    ["RangeError", "Erro de Intervalo"],
    ["URIError", "Erro de URI"],
    ["IndexSizeError", "Erro de Tamanho do Índice"],
    ["HierarchyRequestError", "Erro de Requisição de Hierarquia"],
    ["EncodingError", "Erro de Codificação"],
    ["NamespaceError", "Erro de Namespace"],
    ["SyntaxError", "Erro de Sintaxe"],
    ["SecurityError", "Erro de Segurança"],
    ["InvalidAccessError", "Erro de Acesso Inválido"],
    ["WrongDocumentError", "Erro de Documento Errado"],
    ["NotFoundError", "Erro de Não Encontrado"],
    ["NetworkError", "Erro de Rede"],
    ["URLMismatchError", "Erro de Incompatibilidade de URL"],
    ["TransactionInactiveError", "Erro de Transação Inativa"],
    ["QuotaExceededError", "Erro de Cota Excedida"],
    ["TimeoutError", "Erro de Tempo Esgotado"],
    ["AbortError", "Erro de Aborto"],
    ["VersionError", "Erro de Versão"],
    ["NotSupportedError", "Erro de Não Suportado"],
    ["InvalidStateError", "Erro de Estado Inválido"],
    ["InvalidModificationError", "Erro de Modificação Inválida"],
    ["InvalidCharacterError", "Erro de Caractere Inválido"],
    ["TypeMismatchError", "Erro de Incompatibilidade de Tipo"],
    ["DataCloneError", "Erro de Clone de Dados"],
    ["NotReadableError", "Erro de Não Legível"],
    ["ConstraintError", "Erro de Restrição"],
    ["ReadOnlyError", "Erro de Somente Leitura"],
    ["OperationError", "Erro de Operação"],
    ["UnknownError", "Erro Desconhecido"],
    ["InternalError", "Erro Interno"],
    ["UnhandledException", "Exceção Não Manipulada"],
  ]),
});