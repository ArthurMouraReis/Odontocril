/**
 * Fotografias reais da Odontocril.
 *
 * Coloque os arquivos em public/media/ e informe o nome aqui.
 * Enquanto um item estiver como null, o vídeo usa a ilustração em traço
 * (claramente ilustrativa) no lugar da foto.
 */
export const MEDIA: Record<
  "consultorio" | "cadeira" | "ultrassom" | "vacuo" | "fotopolimerizador" | "assistencia" | "equipe",
  string | null
> = {
  consultorio: null, // ex.: "consultorio.jpg"
  cadeira: null,
  ultrassom: null,
  vacuo: null,
  fotopolimerizador: null,
  assistencia: null,
  equipe: null,
};
