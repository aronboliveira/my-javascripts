function assignProductionLevelForAllSheets() {
  SpreadsheetApp.openById("13zwLjYTwFtGWZZqYjf9NbY1BlqOMaAWRyVGJv2zQXC8")
    .getSheets()
    .forEach(function (sh) {
      if (!sh.getName().startsWith("Biofilme")) return;
      freezeReadOnlyData(sh);
      assignProductionLevel(sh, true);
    });
}
function assignProductionLevel(sh, set) {
  if (set !== true) set = false;
  if (!sh) return;
  var rpName = sh.getName().replace("Biofilme_", "");
  Logger.log("----STARTING----");
  Logger.log("Processando planilha: " + rpName);
  var rgxL = /^L\d+$/i;
  var amRw = findRowContaining(sh, "AMOSTRA"),
    ngRw = findRowContaining(sh, "negativo");
  Logger.log("Valor 'Amostra' encontrado na linha: " + amRw + " em " + rpName);
  Logger.log("Valor 'negativo' encontrado na linha: " + ngRw + " em " + rpName);
  if (!amRw || !ngRw) {
    Logger.log("##ERRORCould not find both 'Amostra' and 'negativo' rows at##" + rpName);
    return;
  }
  var hds = sh.getRange(amRw, 1, 1, sh.getLastColumn()).getValues()[0];
  Logger.log(
    "Cabeçalhos encontrados " +
      " em " +
      rpName +
      " : " +
      hds.map(function (h, i) {
        return "Header " + (i + 1) + ": " + h;
      }),
  );
  var lCls = [],
    mnCl = null,
    lvCl = null,
    amCl = null,
    p95Cl = hds.indexOf("P95") + 1,
    medianCl = hds.indexOf("Mediana") + 1,
    q1Cl = hds.indexOf("Primeiro Quartil") + 1,
    q3Cl = hds.indexOf("Terceiro Quartil") + 1,
    lbCl = hds.indexOf("Limite Inferior") + 1,
    ubCl = hds.indexOf("Limite Superior") + 1,
    olPCl = hds.indexOf("Outliers Positivos") + 1,
    olNCl = hds.indexOf("Outliers Negativos") + 1;
  hds.forEach(function (hd, i) {
    hd = hd.trim();
    if (rgxL.test(hd)) lCls.push(i + 1);
    else if (/^M[ée]dia$/i.test(hd)) mnCl = i + 1;
    else if (/^N[íi]vel$/i.test(hd)) lvCl = i + 1;
    else if (/^AMOSTRA$/i.test(hd)) amCl = i + 1;
  });
  if (lCls.length === 0 || !mnCl || !lvCl) {
    Logger.log("##ERRORCould not find L-patterned columns, 'Média', or 'Nível' column.##" + " em " + rpName);
    return;
  }
  if (p95Cl === 0) p95Cl = hds.indexOf("p95") + 1;
  if (p95Cl === 0) {
    p95Cl = sh.getLastColumn() + 1;
    sh.getRange(amRw, p95Cl).setValue("P95");
  }
  if (medianCl === 0) medianCl = hds.indexOf("mediana") + 1;
  if (medianCl === 0) {
    medianCl = sh.getLastColumn() + 1;
    sh.getRange(amRw, medianCl).setValue("Mediana");
  }
  if (q1Cl === 0) q1Cl = hds.indexOf("Q1") + 1;
  if (q1Cl === 0) q1Cl = hds.indexOf("q1") + 1;
  if (q1Cl === 0) {
    q1Cl = sh.getLastColumn() + 1;
    sh.getRange(amRw, q1Cl).setValue("Primeiro Quartil");
  }
  if (q3Cl === 0) q3Cl = hds.indexOf("Q3") + 1;
  if (q3Cl === 0) q3Cl = hds.indexOf("q3") + 1;
  if (q3Cl === 0) {
    q3Cl = sh.getLastColumn() + 1;
    sh.getRange(amRw, q3Cl).setValue("Terceiro Quartil");
  }
  if (lbCl === 0) lbCl = hds.indexOf("Limite inferior") + 1;
  if (lbCl === 0) {
    lbCl = sh.getLastColumn() + 1;
    sh.getRange(amRw, lbCl).setValue("Limite Inferior");
  }
  if (ubCl === 0) ubCl = hds.indexOf("Limite superior") + 1;
  if (ubCl === 0) {
    ubCl = sh.getLastColumn() + 1;
    sh.getRange(amRw, ubCl).setValue("Limite Superior");
  }
  if (olPCl === 0) olPCl = hds.indexOf("Outliers positivos") + 1;
  if (olPCl === 0) {
    olPCl = sh.getLastColumn() + 1;
    sh.getRange(amRw, olPCl).setValue("Outliers Positivos");
  }
  if (olNCl === 0) olNCl = hds.indexOf("Outliers negativos") + 1;
  if (olNCl === 0) {
    olNCl = sh.getLastColumn() + 1;
    sh.getRange(amRw, olNCl).setValue("Outliers Negativos");
  }
  Logger.log("Coluna de Amostra" + " em " + rpName + " : " + amCl);
  Logger.log("Colunas de Leitura" + " em " + rpName + " : " + lCls);
  Logger.log("Coluna de Média" + " em " + rpName + " : " + mnCl);
  Logger.log("Coluna de Nível" + " em " + rpName + " : " + lvCl);
  Logger.log("Coluna de p95" + " em " + rpName + " : " + p95Cl);
  Logger.log("Coluna de Mediana" + " em " + rpName + " : " + medianCl);
  Logger.log("Coluna de Primeiro Quartil" + " em " + rpName + " : " + q1Cl);
  Logger.log("Coluna de Terceiro Quartil" + " em " + rpName + " : " + q3Cl);
  Logger.log("Coluna de Limite Inferior" + " em " + rpName + " : " + lbCl);
  Logger.log("Coluna de Limite Superior" + " em " + rpName + " : " + ubCl);
  Logger.log("Coluna de Outliers Positivos" + " em " + rpName + " : " + olPCl);
  Logger.log("Coluna de Outliers Negativos" + " em " + rpName + " : " + olNCl);
  var p95Refs = [],
    ngMn = 0,
    sd = 0,
    ngVls = sh.getRange(ngRw, 1, 1, sh.getLastColumn()).getValues()[0],
    ngLValues = lCls
      .map(function (col) {
        var vl = ngVls[col - 1];
        return typeof vl === "number" && !isNaN(vl) ? vl : null;
      })
      .filter(function (vl) {
        return vl !== null;
      });
  Logger.log("Valores capturados para Controle Negativo" + " em " + rpName + " : " + ngLValues);
  if (ngLValues.length > 0) {
    ngMn =
      ngLValues.reduce(function (sum, vl) {
        return sum + vl;
      }, 0) / ngLValues.length;
    sd = calculateStandardDeviation(ngLValues, ngMn);
    Logger.log("Média arimética de Controle Negativo" + " em " + rpName + " : " + ngMn);
    Logger.log("Desvio Padrão de Controle Negativo " + " em " + rpName + " : " + sd);
    let sdFlagCell = findCellByValue(sh, "SD_FLAG");
    if (sdFlagCell) {
      var sdRef = sd * 3,
        difRef = ngMn - sdRef,
        values = [sd, sdRef, difRef, difRef * 2, difRef * 4];
      values.forEach(function (v, i) {
        Logger.log(
          "Valor para Célula " +
            sh.getRange(sdFlagCell.getRow() - 1, sdFlagCell.getColumn() + i).getA1Notation() +
            " em " +
            rpName +
            " : " +
            v,
        );
      });
      if (set)
        values.forEach(function (v, i) {
          sh.getRange(sdFlagCell.getRow() + i, sdFlagCell.getColumn() - 1).setValue(v);
        });
    }
  }
  for (var row = amRw + 1; row < ngRw; row++) {
    var rwVls = sh.getRange(row, 1, 1, sh.getLastColumn()).getValues()[0],
      lVls = lCls
        .map(function (col) {
          var vl = rwVls[col - 1];
          return typeof vl === "number" && !isNaN(vl) ? vl : null;
        })
        .filter(function (vl) {
          return vl !== null;
        });
    if (lVls.length > 0) {
      var mn =
        lVls.reduce(function (sum, vl) {
          return sum + vl;
        }, 0) / lVls.length;
      var level = determineLevel(mn, ngMn, sd, sh);
      Logger.log("Média na Célula " + sh.getRange(row, mnCl).getA1Notation() + " em " + rpName + " : " + mn);
      Logger.log("Nível na Célula " + sh.getRange(row, lvCl).getA1Notation() + " em " + rpName + " : " + level);
      if (set) {
        sh.getRange(row, mnCl).setValue(mn);
        sh.getRange(row, lvCl).setValue(level);
      }
    }
    var mdCel = sh.getRange(row, mnCl).getValue();
    if (typeof mdCel === "number" && isFinite(mdCel)) {
      Logger.log(
        "Incluindo célula para análise de p95: " +
          sh.getRange(row, mnCl).getA1Notation() +
          ", Linhagem: " +
          sh.getRange(row, amCl).getValue(),
      );
      p95Refs.push({
        r: row,
        v: mdCel,
        c: sh.getRange(row, mnCl).getA1Notation(),
        l: sh.getRange(row, amCl).getValue(),
      });
    }
  }
  determineP95(p95Refs, sh, p95Cl, set);
  determineBoxPlot(
    p95Refs,
    sh,
    {
      median: medianCl,
      q1: q1Cl,
      q3: q3Cl,
      lb: lbCl,
      ub: ubCl,
      olp: olPCl,
      oln: olNCl,
    },
    set,
  );
  sh.getRange("K1").setValue("Generated by Google App Scripts");
}
function determineLevel(mn, ngMn, sd, sh) {
  var th1 = ngMn + sd * 3,
    th2 = th1 * 2,
    th3 = th1 * 4;
  Logger.log(
    "[Média, Média para negativo, limite 1, limite 2, limite 3] para " +
      sh.getName().replace("Biofilme_", "") +
      " : " +
      [mn, ngMn, th1, th2, th3],
  );
  if (mn <= th1) return "Não Produtor";
  else if (mn > th1 && mn <= th2) return "Fraco";
  else if (mn > th2 && mn <= th3) return "Médio";
  else if (mn > th3) return "Forte";
  return "#ERRO";
}
function calculateStandardDeviation(vls, mn) {
  Logger.log("----CALCULATING STANDARD DEVIATION----");
  Logger.log(vls);
  Logger.log(mn);
  return Math.sqrt(
    vls.reduce(function (a, v) {
      return a + Math.pow(v - mn, 2);
    }, 0) / vls.length,
  );
}
function findRowContaining(sh, st) {
  var dt = sh.getDataRange().getValues();
  st = st.toLowerCase();
  for (var row = 0; row < dt.length; row++) {
    for (var col = 0; col < dt[row].length; col++) {
      if (typeof dt[row][col] === "string" && dt[row][col].toLowerCase() === st) {
        return row + 1;
      }
    }
  }
  return null;
}
function findCellByValue(sh, vl) {
  var dt = sh.getDataRange().getValues();
  for (var row = 0; row < dt.length; row++) {
    for (var col = 0; col < dt[row].length; col++) {
      if (dt[row][col] === vl) return sh.getRange(row + 1, col + 1);
    }
  }
  return null;
}
function determineP95(refs, sh, pCl, set) {
  Logger.log("---- DETERMING P95 -----");
  if (set !== true) set = false;
  if (refs.length === 0) {
    Logger.log("##ERROR:Failed to populate p95 References##");
    return;
  }
  var vs = refs
      .map(function (r) {
        return r.v;
      })
      .sort(function (a, b) {
        return a - b;
      }),
    pv = vs[Math.ceil(0.95 * vs.length) - 1],
    rpNm = sh.getName().replace("Biofilme_", "");
  Logger.log("Limite de p95 definido em " + pv + " para " + rpNm);
  refs.forEach(function (r) {
    if (isNaN(r.v) || !isFinite(r.v)) {
      if (set) sh.getRange(r.r, pCl).setValue("Não avaliado");
      return;
    }
    if (r.v > pv) {
      Logger.log(
        "Análise de p95 para " +
          "Linhagem " +
          r.l +
          " Célula " +
          sh.getRange(r.r, pCl).getA1Notation() +
          " em " +
          rpNm +
          " : Extremo",
      );
      if (set) sh.getRange(r.r, pCl).setValue("Extremo");
    } else {
      Logger.log(
        "Análise de p95 para " +
          "Linhagem " +
          r.l +
          " Célula " +
          sh.getRange(r.r, pCl).getA1Notation() +
          " em " +
          rpNm +
          " : Padrão",
      );
      if (set) sh.getRange(r.r, pCl).setValue("Padrão");
    }
  });
}
function determineBoxPlot(refs, sh, cols, set) {
  Logger.log("---- DETERMING BOXPLOT -----");
  if (set !== true) set = false;
  if (refs.length === 0) {
    Logger.log("##ERROR: Failed to populate Boxplot References##");
    return;
  }
  var vs = refs
      .map(function (r) {
        return { v: r.v, l: r.l };
      })
      .sort(function (a, b) {
        return a.v - b.v;
      }),
    mid = Math.floor(vs.length / 2),
    median = vs.length % 2 !== 0 ? vs[mid].v : (vs[mid - 1].v + vs[mid].v) / 2,
    q1 = calcQuart(vs, 0.25),
    q3 = calcQuart(vs, 0.75),
    iqr = q3 - q1,
    lb = q1 - 1.5 * iqr,
    ub = q3 + 1.5 * iqr,
    olP = vs.filter(function (v) {
      return v.v > ub;
    }),
    olN = vs.filter(function (v) {
      return v.v < lb;
    }),
    rpNm = sh.getName().replace("Biofilme_", "");
  Logger.log("Mediana para médias em " + rpNm + " : " + median);
  Logger.log("Primeiro quartil para " + rpNm + " : " + q1);
  Logger.log("Terceiro quartil para " + rpNm + q3);
  Logger.log("Limite Inferior do Boxplot para " + rpNm + lb);
  Logger.log("Limite Superior do Boxplot para " + rpNm + ub);
  Logger.log(
    "Outliers positivos do Boxplot para " +
      rpNm +
      " " +
      String(
        olP.map(function (o) {
          return o.l;
        }),
      ),
  );
  Logger.log(
    "Outliers negativos do Boxplot para " +
      rpNm +
      " " +
      String(
        olN.map(function (o) {
          return o.l;
        }),
      ),
  );
  refs.forEach(function (r) {
    Object.keys(cols).forEach(function (k) {
      var targ = sh.getRange(r.r, cols[k]);
      switch (k) {
        case "median":
          var medianRel = "Abaixo";
          if (r.v > median) medianRel = "Acima";
          else if (r.v === median) medianRel = "Mediano";
          else if (isNaN(r.v) || !isFinite(r.v)) medianRel = "Não avaliado";
          Logger.log("Mediana de " + r.l + " : " + medianRel);
          if (set) targ.setValue(medianRel);
          break;
        case "q1":
          var q1Rel = "Acima";
          if (r.v < q1) q1Rel = "Abaixo";
          else if (r.v === q1) q1Rel = "No Quartil";
          else if (isNaN(r.v) || !isFinite(r.v)) q1Rel = "Não avaliado";
          Logger.log("Relação com Primeiro quartil de " + r.l + " : " + q1Rel);
          if (set) targ.setValue(q1Rel);
          break;
        case "q3":
          var q3Rel = "Abaixo";
          if (r.v > q3) q3Rel = "Acima";
          else if (r.v === q3) q3Rel = "No Quartil";
          else if (isNaN(r.v) || !isFinite(r.v)) q3Rel = "Não avaliado";
          Logger.log("Relação com Terceiro quartil de " + r.l + " : " + q3Rel);
          if (set) targ.setValue(q3Rel);
          break;
        case "lb":
          var lbRel = "Acima";
          if (r.v < lb) lbRel = "Abaixo";
          else if (r.v === lb) lbRel = "No Limite";
          else if (isNaN(r.v) || !isFinite(r.v)) lbRel = "Não avaliado";
          Logger.log("Relação com Limite inferior de " + r.l + " : " + lbRel);
          if (set) targ.setValue(lbRel);
          break;
        case "ub":
          var ubRel = "Abaixo";
          if (r.v > ub) ubRel = "Acima";
          else if (r.v === ub) ubRel === "No Limite";
          else if (isNaN(r.v) || !isFinite(r.v)) ubRel = "Não avaliado";
          Logger.log("Relação com Limite superior de " + r.l + " : " + ubRel);
          if (set) targ.setValue(ubRel);
          break;
        case "olp":
          Logger.log("Outliers positivos de " + r.l + " " + String(olP));
          if (set)
            String(olP) === "" || String(olP) === "[]"
              ? targ.setValue("Nulo")
              : targ.setValue(
                  olP
                    .map(function (o) {
                      return o.l;
                    })
                    .join(", "),
                );
          break;
        case "oln":
          Logger.log("Outliers negativos de " + r.l + " " + String(olN));
          if (set)
            String(olN) === "" || String(olN) === "[]"
              ? targ.setValue("Nulo")
              : targ.setValue(
                  olN
                    .map(function (o) {
                      return o.l;
                    })
                    .join(", "),
                );
          break;
        default:
          Logger.log("##ERROR READING KEY FOR BOXPLOT##");
      }
    });
  });
}
function calcQuart(vs, q) {
  var p = (vs.length - 1) * q,
    b = Math.floor(p);
  return vs[b + 1].v ? vs[b].v + (p - b) * (vs[b + 1].v - vs[b].v) : vs[b].v;
}
function freezeReadOnlyData(sh) {
  Logger.log("----FREEZANDO----");
  var rgxL = /^L\d+$/i,
    lCls = [],
    amRw = findRowContaining(sh, "AMOSTRA"),
    ngRw = findRowContaining(sh, "negativo"),
    hds = sh.getRange(amRw, 1, 1, sh.getLastColumn()).getValues()[0];
  hds.forEach(function (hd, i) {
    hd = hd.trim();
    if (rgxL.test(hd)) lCls.push(i + 1);
  });
  lCls.forEach(function (col) {
    Logger.log("Bloqueando edição de coluna " + col + " em " + sh.getName().replace("Biofilme_", ""));
    var rg = sh.getRange(amRw + 1, col, ngRw - amRw + 1),
      ptc = rg.protect().setDescription("Protected Range L " + col);
    ptc.removeEditors(ptc.getEditors());
    if (ptc.canDomainEdit()) ptc.setDomainEdit(false);
  });
  Logger.log("Faixas da linha " + (amRw + 1) + " a " + ngRw + " em Colunas de Linhagens foram protegidas");
}
function unfreezeReadOnlyData(sh) {
  var rgxL = /^L\d+$/i,
    lCls = [],
    amRw = findRowContaining(sh, "AMOSTRA"),
    ngRw = findRowContaining(sh, "negativo"),
    hds = sh.getRange(amRw, 1, 1, sh.getLastColumn()).getValues()[0];
  hds.forEach(function (hd, i) {
    hd = hd.trim();
    if (rgxL.test(hd)) lCls.push(i + 1);
  });
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (pr) {
    var ptRg = pr.getRange();
    lCls.forEach(function (col) {
      if (ptRg.getColumn() === col && ptRg.getRow() >= amRw + 1 && ptRg.getLastRow() <= ngRw) {
        pr.remove();
        Logger.log("Unprotected range in column : " + col + ", from row " + (amRw + 1));
      }
    });
  });
  Logger.log("Faixas da linha " + (amRw + 1) + " a " + ngRw + " em Colunas de Linhagens foram protegidas");
}
