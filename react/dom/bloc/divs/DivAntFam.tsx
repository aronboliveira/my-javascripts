import { DivAntFamProps } from "../../../src/lib/global/declarations/interfaces";
import { textTransformPascal } from "../../../src/lib/global/gModel";
export default function DivAntFam({
  name,
  fullName = "",
  ta = false,
  gen = false,
  div = true,
}: DivAntFamProps): JSX.Element {
  const PascalName = /_/g.test(name)
    ? name
        .split("_")
        .map(part => textTransformPascal(part))
        .join("")
    : textTransformPascal(name);
  return div ? (
    <div className='divAdd gridThreeCol divAntFamCheck' role='list' id={`divAddFam${PascalName}`}>
      <span
        role='group'
        className='spanSub spanSectAnt'
        id={`span${PascalName}FamG`}
        style={{ marginBottom: "0.5rem" }}>
        <strong>Ascendentes com Diagnóstico(s) ou Suspeita(s):</strong>
      </span>
      <br role='presentation' />
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_mae`}
          id={`${name}FamMaeId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Mãe — ${fullName}`}
        />{" "}
        Mãe
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_pai`}
          id={`${name}FamPaiId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Pai — ${fullName}`}
        />{" "}
        Pai
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_avof_m`}
          id={`${name}FamAvóMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Avó Materna — ${fullName}`}
        />{" "}
        Avó Materna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_avof_p`}
          id={`${name}FamAvóPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Avó Paterna — ${fullName}`}
        />{" "}
        Avó Paterna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_avom_m`}
          id={`${name}FamAvoMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Avô Materno — ${fullName}`}
        />{" "}
        Avô Materno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_avom_p`}
          id={`${name}FamAvoPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Avô Paterno — ${fullName}`}
        />{" "}
        Avô Paterno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bisf_mm`}
          id={`${name}FamBisavóMatMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavó Mater-materna — ${fullName}`}
        />{" "}
        Bisavó Mater-materna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bisf_mp`}
          id={`${name}FamBisavóMatPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavó Mater-paterna — ${fullName}`}
        />{" "}
        Bisavó Mater-paterna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bisf_pm`}
          id={`${name}FamBisavóPatMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavó Pater-materna — ${fullName}`}
        />{" "}
        Bisavó Pater-materna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bisf_pp`}
          id={`${name}FamBisavóPatPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavó Pater-paterna — ${fullName}`}
        />{" "}
        Bisavó Pater-paterna
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bism_mm`}
          id={`${name}FamBisavoMatMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavô Mater-materno — ${fullName}`}
        />{" "}
        Bisavô Mater-materno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bism_mp`}
          id={`${name}FamBisavoMatPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavô Mater-paterno — ${fullName}`}
        />{" "}
        Bisavô Mater-paterno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bism_pm`}
          id={`${name}FamBisavoPatMatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavô Pater-materno — ${fullName}`}
        />{" "}
        Bisavô Pater-materno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_bism_pp`}
          id={`${name}FamBisavoPatPatId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Bisavô Pater-paterno — ${fullName}`}
        />{" "}
        Bisavô Pater-paterno
      </span>
      <span role='listitem' className='cbDoencSubt'>
        <input
          type='checkbox'
          name={`${name}_tris`}
          id={`${name}FamOtherId`}
          className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
          data-title={`Trisavós ou anteriores — ${fullName}`}
        />{" "}
        Trisavós ou anteriores
      </span>
    </div>
  ) : (
    <div
      className={gen ? `divGen container-lg` : `divAdd divAntFam`}
      id={gen ? `divGen${PascalName}` : `divAddFam${PascalName}`}
      role='group'>
      {ta && (
        <>
          <textarea
            name={`${name}_fam`}
            id={`${name}FamGeralId`}
            className={`form-control taOp ta${PascalName}`}
            placeholder={`Escreva aqui sobre a(s) ${fullName}`}
            data-title={`Descrição — ${fullName}`}></textarea>
          <br role='presentation' />
        </>
      )}
      <div className='divAdd gridThreeCol divAntFamCheck' role='list' id={`divAddFam${PascalName}`}>
        <span
          role='group'
          className='spanSub spanSectAnt'
          id={`span${PascalName}FamG`}
          style={{ marginBottom: "0.5rem" }}>
          <strong>Ascendentes com Diagnóstico(s) ou Suspeita(s):</strong>
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_mae`}
            id={`${name}FamMaeId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Mãe — ${fullName}`}
          />{" "}
          Mãe
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_pai`}
            id={`${name}FamPaitId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Pai — ${fullName}`}
          />{" "}
          Pai
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_avof_m`}
            id={`${name}FamAvóMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Avó Materna — ${fullName}`}
          />{" "}
          Avó Materna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_avof_p`}
            id={`${name}FamAvóPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Avó Paterna — ${fullName}`}
          />{" "}
          Avó Paterna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_avom_m`}
            id={`${name}FamAvoMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Avô Materno — ${fullName}`}
          />{" "}
          Avô Materno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_avom_p`}
            id={`${name}FamAvoPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Avô Paterno — ${fullName}`}
          />{" "}
          Avô Paterno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bisf_mm`}
            id={`${name}FamBisavóMatMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavó Mater-materna — ${fullName}`}
          />{" "}
          Bisavó Mater-materna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bisf_mp`}
            id={`${name}FamBisavóMatPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavó Mater-paterna — ${fullName}`}
          />{" "}
          Bisavó Mater-paterna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bisf_pm`}
            id={`${name}FamBisavóPatMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavó Pater-materna — ${fullName}`}
          />{" "}
          Bisavó Pater-materna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bisf_pp`}
            id={`${name}FamBisavóPatPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavó Pater-paterna — ${fullName}`}
          />{" "}
          Bisavó Pater-paterna
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bism_mm`}
            id={`${name}FamBisavoMatMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavô Mater-materno — ${fullName}`}
          />{" "}
          Bisavô Mater-materno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bism_mp`}
            id={`${name}FamBisavoMatPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavô Mater-paterno — ${fullName}`}
          />{" "}
          Bisavô Mater-paterno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bism_pm`}
            id={`${name}FamBisavoPatMatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavô Pater-materno — ${fullName}`}
          />{" "}
          Bisavô Pater-materno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_bism_pp`}
            id={`${name}FamBisavoPatPatId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Bisavô Pater-paterno — ${fullName}`}
          />{" "}
          Bisavô Pater-paterno
        </span>
        <span role='listitem' className='cbDoencSubt'>
          <input
            type='checkbox'
            name={`${name}_tris`}
            id={`${name}FamOtherId`}
            className={`cpbOp famOp op${PascalName} op${PascalName}Fam op${PascalName}GFam`}
            data-title={`Trisavós ou anteriores — ${fullName}`}
          />{" "}
          Trisavós ou anteriores
        </span>
      </div>
    </div>
  );
}
