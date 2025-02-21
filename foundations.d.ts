import { AxiosResponse } from "axios";
export type nlStr = string | null;
export type voidish = undefined | null;
export type nlEl = Element | null;
export type hexDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";
export type color = `#${string}`;
export interface MinMaxed {
  min: number;
  max: number;
}
export interface Identifiable {
  id?: string;
}
export interface RequestOpts {
  request: Record<string, any>;
  id: string;
  priority?: number;
}
export interface Provider {
  setup: () => Provider;
}
export interface Processor<T> {
  process: (data: T) => any;
}
export interface Controller {
  _reqs: RequestOptions[] | null;
  max: number;
}
export interface PostController extends Controller {
  post: (...args: any) => NextResponse | Response;
}
export interface PostController {
  post: (
    data: { [k: string]: string },
    headers: PostHeaders
  ) => AxiosResponse | Response;
}
export interface Mapper {
  [methodName: string]: (data: T, ...args: any) => Exclude<any, T>;
}
export interface routes {
  sendRequirements: string;
}
export type roleType =
  | "executivoAdministrativo"
  | "financeiro"
  | "comercial"
  | "marketing"
  | "suporteTecnicoN1"
  | "suporteTecnicoN2"
  | "operatorio"
  | "desenvolvimento"
  | "devOps"
  | "undefined";
export type officeTopicType =
  | "DailyTasks"
  | "MainTasks"
  | "MainSw"
  | "AddSw"
  | "Priority"
  | "Optimize"
  | "Challenges"
  | "Collaboration";
export type dictLabelsRangeGroups = "office" | "ai";
export type officeSoftwareLabels = "apps" | "platforms";
export type rangeCtxId =
  | "businessInteligence"
  | "cloudStorage"
  | "Crms"
  | "docs"
  | "Erps"
  | "formBuilders"
  | "planning"
  | "spreadSheets";
export type aiGroups = "audio" | "image" | "llms" | "video";
export type addQuestionsKey = rangeCtxId | aiGroups;
export type RangeCtxComponentNames =
  | "AudioAi"
  | "ImageAi"
  | "Llms"
  | "VideoAi"
  | "Bi"
  | "Crms"
  | "Docs"
  | "Erps"
  | "FormBuilders"
  | "Planning"
  | "Spreadsheets"
  | "StoragePlatforms";
export type OfficeBlocks = {
  apps: {
    doc: string;
    form: string;
    spreadSheet: string;
    storage: string;
  };
  platforms: {
    bi: string;
    crm: string;
    erp: string;
    planning: string;
  };
};
export type AiBlocks = {
  audio: string;
  image: string;
  llms: string;
  video: string;
};
export type fmBaseKeys = "tpl" | "rsp" | "emb" | "slc" | "plt";
export type csBaseKeys = "shr" | "syn" | "org";
export type aiAdBaseKeys = "gen" | "evl" | "tts" | "cln" | "int";
export type aiAdExpertKeys = aiAdBaseKeys | "adv" | "vol" | "sec";
export type llmBaseKeys = "lan" | "val" | "col";
export type repeatingKeys =
  | "fmt"
  | "sum"
  | "tmp"
  | "mcr"
  | "big"
  | "arr"
  | "tbd";
export type repeatingDefinitionKeys =
  | "sum"
  | "col"
  | "exp"
  | "fil"
  | "frq"
  | "cht"
  | "scp"
  | "yn"
  | "dbi"
  | "colab"
  | "sec"
  | "tmp"
  | "ast"
  | "docp"
  | "lvl"
  | "txts"
  | "txtl";
export type complexityLevel = 1 | 2 | 3 | 4 | 5;
export type complexityLabel = "beginner" | "intermediate" | "expert";
export type appGroups = "Tasks" | "Platforms";
export type roleQuestionsMap = Map<
  officeTopicType,
  Map<Omit<roleType | "default", "undefined">, string>
>;
export type mapLabels = "roleQuestions";
export type TelType = "local" | "national" | "complete";
//Patterns
export type PseudoNum = `${number}`;
export type DDDPattern = `${number}${number}`;
export type ValidPhonePattern =
  | `${number}${number}${number}${number}${number}${"-"}?${number}${number}${number}${number}`
  | `${DDDPattern}${" " | ""}${number}${number}${number}${number}${
      | number
      | ""}${"-"}?${number}${number}${number}${number}`
  | `${"+" | ""}${number}${number | ""}${number | ""}${" " | ""}${DDDPattern}${
      | " "
      | ""}${number}${number}${number}${number}${
      | number
      | ""}${"-"}?${number}${number}${number}${number}`;
//HTTP
export type HttpBaseKeys = "Accept" | "Authorization";
export type BaseValues =
  | "application/json"
  | "text/plain"
  | "application/xml"
  | "text/xml";
export type AcceptValues =
  | BaseValues
  | "text/html"
  | "*/*"
  | "application/javascript";
export type AuthorizationValues =
  | `Bearer ${string}`
  | `Basic ${string}`
  | `Digest ${string}`
  | `OAuth ${string}`;
export type UpdateHeaderKeys = HttpBaseKeys | "Content-Type";
export type ContentTypeValues =
  | BaseValues
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/css"
  | "text/csv";
export type CacheControlValues =
  | "no-cache"
  | "no-store"
  | "max-age=0"
  | `max-age=${number}`
  | "must-revalidate";
export type AllowValues =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | "PATCH";
export type CustomHeaderKeys =
  | "X-Correlation-ID"
  | "X-Request-ID"
  | "X-Forwarded-For"
  | "X-Forwarded-Proto";
export type GetHeaderKeys =
  | HttpBaseKeys
  | "Cache-Control"
  | "If-None-Match"
  | "If-Modified-Since";
export type PostHeaderKeys =
  | UpdateHeaderKeys
  | "X-Requested-With"
  | "Content-Length"
  | CustomHeaderKeys;
export type OptionsHeaderKeys = HttpBaseKeys | "Allow";
export type HeaderKeyValueUnion =
  | { key: "Accept"; value: AcceptValues }
  | { key: "Authorization"; value: AuthorizationValues }
  | { key: "Cache-Control"; value: CacheControlValues }
  | { key: "Content-Type"; value: ContentTypeValues }
  | {
      key: "X-Requested-With";
      value: "XMLHttpRequest" | string;
    }
  | { key: "Allow"; value: AllowValues }
  | { key: "Content-Length"; value: `${number}` }
  | { key: CustomHeaderKeys; value: CustomHeaderValues };
export type GeneralHeaders = {
  Accept?: AcceptValues;
  Authorization?: AuthorizationValues;
  "Cache-Control"?: CacheControlValues;
  "Content-Type"?: ContentTypeValues;
  "X-Requested-With"?: string;
  "Content-Length"?: string;
};
export type GetHeaders = GeneralHeaders & {
  "If-None-Match"?: string;
  "If-Modified-Since"?: string;
};
export type PostHeaders = GeneralHeaders & {
  "X-Requested-With"?: string;
  "Content-Length"?: string;
} & Optional<Record<CustomHeaderKeys, CustomHeaderValues>>;
export type OptionsHeaders = GeneralHeaders & {
  Allow?: AllowValues;
};
export type HTTPHeadersByMethod = {
  GET: GetHeaders;
  POST: PostHeaders;
  OPTIONS: OptionsHeaders;
  PUT: GeneralHeaders;
  DELETE: GeneralHeaders;
};
export type HTTPReturns =
  | "info"
  | "successful"
  | "redirect"
  | "serverError"
  | "clientError";
export type HTTPReturnsFriendlyEn =
  | "Information"
  | "Successful"
  | "Redirection"
  | "Server Error"
  | "Client Error";
export type HTTPReturnsFriendlyPt =
  | "Informação"
  | "Sucesso"
  | "Redireção"
  | "Erro no Servidor"
  | "Erro no Cliente";
export type HTTPReturnsFriendly = HTTPReturnsFriendlyEn | HTTPReturnsFriendlyPt;
export type ResponseLanguage<PT extends string, EN extends string> = {
  pt: PT;
  en: EN;
};
export type HTTPResponseInfoCode = 100 | 101 | 102 | 103;
export type HTTPResponseSuccessfulCode =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;
export type HTTPResponseRedirectCode =
  | 300
  | 301
  | 302
  | 303
  | 304
  | 306
  | 307
  | 308;
export type HTTPResponseClientErrorCode =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451;
export type HTTPResponseServerErrorCode =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;
export type HTTPResponseInfoLabelEn =
  | "Continue"
  | "Switching Protocols"
  | "Processing"
  | "Early Hints";
export type HTTPResponseInfoLabelPt =
  | "Continuar"
  | "Trocando Protocolos"
  | "Processando"
  | "Primeiras Dicas";
export type HTTPResponseInfoLabel =
  | HTTPResponseInfoLabelEn
  | HTTPResponseInfoLabelPt;
export type HTTPResponseSuccessfulLabelEn =
  | "OK"
  | "Created"
  | "Accepted"
  | "Non-Authoritative Information"
  | "No Content"
  | "Reset Content"
  | "Partial Content"
  | "Multi-Status"
  | "Already Reported"
  | "IM Used";
export type HTTPResponseSuccessfulLabelPt =
  | "Tudo Certo"
  | "Criado"
  | "Aceito"
  | "Informações Não-Autoritativas"
  | "Sem Conteúdo"
  | "Redefinir Conteúdo"
  | "Conteúdo Parcial"
  | "Status Múltiplo"
  | "Já Reportado"
  | "IM Usado";
export type HTTPResponseSuccessfulLabel =
  | HTTPResponseSuccessfulLabelEn
  | HTTPResponseSuccessfulLabelPt;
export type HTTPResponseRedirectLabelEn =
  | "Multiple Choices"
  | "Moved Permanently"
  | "Found"
  | "See Other"
  | "Not Modified"
  | "Unused"
  | "Temporary Redirect"
  | "Permanent Redirect";
export type HTTPResponseRedirectLabelPt =
  | "Múltiplas Escolhas"
  | "Movido Permanentemente"
  | "Encontrado"
  | "Ver Outro"
  | "Não Modificado"
  | "Não Usado"
  | "Redirecionamento Temporário"
  | "Redirecionamento Permanente";
export type HTTPResponseRedirectLabel =
  | HTTPResponseRedirectLabelEn
  | HTTPResponseRedirectLabelPt;
export type HTTPResponseClientErrorLabelEn =
  | "Bad Request"
  | "Unauthorized"
  | "Payment Required"
  | "Forbidden"
  | "Resource Not Found"
  | "Method Not Allowed"
  | "Not Acceptable"
  | "Proxy Authentication Required"
  | "Request Timeout"
  | "Conflict"
  | "Gone"
  | "Length Required"
  | "Preconditional Failed"
  | "Content Too Large"
  | "URI Too Long"
  | "Unsupported Media Type"
  | "Range Not Satisfiable"
  | "Expectation Failed"
  | "I'm a teapot"
  | "Misdirected Request"
  | "Unprocessable Content"
  | "Locked"
  | "Failed Dependency"
  | "Too Early"
  | "Upgrade Required"
  | "Precondition Required"
  | "Too Many Requests"
  | "Request Header Fields Too Large"
  | "Unavailable For Legal Reasons";
export type HTTPResponseClientErrorLabelPt =
  | "Requisição Inválida"
  | "Não Autorizado"
  | "Pagamento Necessário"
  | "Proibido"
  | "Recurso não encontrado"
  | "Método Não Permitido"
  | "Não Aceitável"
  | "Autenticação de Proxy Necessária"
  | "Tempo Limite da Requisição"
  | "Conflito"
  | "Perdido"
  | "Comprimento Necessário"
  | "Pré-condição Falhou"
  | "Conteúdo Muito Grande"
  | "URI Muito Longo"
  | "Tipo de Mídia Não Suportado"
  | "Intervalo Não Satisfatório"
  | "Expectativa Falhou"
  | "Eu sou um bule"
  | "Requisição Mal Direcionada"
  | "Conteúdo Não Processável"
  | "Bloqueado"
  | "Dependência Falhou"
  | "Muito Cedo"
  | "Atualização Necessária"
  | "Pré-condição Necessária"
  | "Muitas Requisições"
  | "Campos do Cabeçalho da Requisição Muito Grandes"
  | "Indisponível por Motivos Legais";
export type HTTPResponseClientErrorLabel =
  | HTTPResponseClientErrorLabelEn
  | HTTPResponseClientErrorLabelPt;
export type HTTPResponseServerErrorLabelEn =
  | "Internal Server Error"
  | "Not Implemented"
  | "Bad Gateway"
  | "Service Unavailable"
  | "Gateway Timeout"
  | "HTTP Version Not Supported"
  | "Variant Also Negotiates"
  | "Insufficient Storage"
  | "Loop Detected"
  | "Not Extended"
  | "Network Authentication Required";
export type HTTPResponseServerErrorLabelPt =
  | "Erro Interno do Servidor"
  | "Não Implementado"
  | "Gateway Inválido"
  | "Serviço Indisponível"
  | "Tempo Limite do Gateway"
  | "Versão HTTP Não Suportada"
  | "Variante Também Negocia"
  | "Armazenamento Insuficiente"
  | "Loop Detectado"
  | "Não Estendido"
  | "Autenticação de Rede Necessária";
export type HTTPResponseServerErrorLabel =
  | HTTPResponseServerErrorLabelEn
  | HTTPResponseServerErrorLabelPt;
export type HTTPResponseInfo = {
  [K in HTTPResponseInfoLabel]: HTTPResponseInfoCode;
};
export type HTTPResponseSuccessful = {
  [K in HTTPResponseSuccessfulLabel]: HTTPResponseSuccessfulCode;
};
export type HTTPResponseRedirect = {
  [K in HTTPResponseRedirectLabel]: HTTPResponseRedirectCode;
};
export type HTTPResponseClientError = {
  [K in HTTPResponseClientErrorLabel]: HTTPResponseClientErrorCode;
};
export type HTTPResponseServerError = {
  [K in HTTPResponseServerErrorLabel]: HTTPResponseServerErrorCode;
};
export type HTTPResponseErrorCode =
  | HTTPResponseClientErrorCode
  | HTTPResponseServerErrorCode;
export type HTTPResponseErrorLabel =
  | HTTPResponseClientErrorLabel
  | HTTPResponseServerErrorLabel;
export type HTTPResponseError = {
  [K in HTTPResponseErrorLabel]: HTTPResponseErrorCode;
};
export type HTTPResponseCode =
  | HTTPResponseInfoCode
  | HTTPResponseSuccessfulCode
  | HTTPResponseRedirectCode
  | HTTPResponseErrorCode;
export type HTTPResponseLabel =
  | HTTPResponseInfoLabel
  | HTTPResponseSuccessfulLabel
  | HTTPResponseRedirectLabel
  | HTTPResponseErrorLabel;
export type HTTPResponse = {
  [K in HTTPResponseLabel]: HTTPResponseCode;
};
