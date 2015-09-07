-- Table: registro

-- DROP TABLE registro;

CREATE TABLE registro
(
  id serial NOT NULL,
  nome text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  imagem text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  sexo character varying(10) COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  olhos text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  cor_da_pele text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  cabelo text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  peso_aproximado text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  altura_aproximada text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  tipo_fisico text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  transtorno_mental text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  idade text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  data_nascimento text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  dias_desaparecido text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  data_desaparecimento text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  bairro_desaparecimento text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  cidade_desaparecimento text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  uf_desaparecimento text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  marca_caracteristica text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  status text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  informacoes text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  boletim_ocorrencia text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  fonte text COLLATE pg_catalog."pt_BR.utf8" NOT NULL,
  geolocalizacao geometry(Point,4674),
  longitude numeric,
  latitude numeric,
  CONSTRAINT registro_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE registro
  OWNER TO postgres;
COMMENT ON TABLE registro
  IS 'Banco experimental para armazenar os dados, já tratados, do crawler que busca pessoas desaparecidas.';

---- Altere "path" e "arquivoGeocodificado.csv" pelo seu caminho absoluto e o nome do arquivo que contém os endereços geocodificados (longitude e latitude)
BEGIN;
CREATE TEMP TABLE tmp_x (id int, longitude decimal, latitude decimal);
COPY tmp_x FROM '/path/arquivoGeocodificado.csv' delimiter ',' CSV header;
UPDATE registro SET latitude = tmp_x.latitude SET longitude = tmp_x.longitude FROM tmp_x WHERE tmp_x.id = registro.id; 
COMMIT;