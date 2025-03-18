function myFunction() {
  SpreadsheetApp.openById("1cny-EL4lTwCG1a7-MjZIbNawG4Ejb7GIvlHGm65vQus")
    .getSheets()
    .forEach(function (sh) {
      executeSheet(sh, true);
    });
}
function executeSheet(planilha, preencher) {
  if (preencher !== true) preencher = false;
  planilha
    .getRange("A1:I14")
    .getValues()
    .forEach(function (linha, indice) {
      linha.forEach(function (celula, segundoIndice) {
        Logger.log(planilha.getRange(indice + 1, segundoIndice + 1).getA1Notation() + ": " + celula);
        if (segundoIndice === 0 || segundoIndice % 2 === 0)
          planilha.getRange(indice + 1, segundoIndice + 1).setValue("ÍMPAR");
        else planilha.getRange(indice + 1, segundoIndice + 1).setValue("PAR");
      });
    });
}
