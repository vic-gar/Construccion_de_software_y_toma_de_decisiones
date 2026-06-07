DROP TABLE IF EXISTS Entregan;
DROP TABLE IF EXISTS Proyectos;
DROP TABLE IF EXISTS Proveedores;
DROP TABLE IF EXISTS Materiales;

--
-- TOC entry 222 (class 1259 OID 24632)
-- Name: Entregan; Type: TABLE; Schema: public; Owner: ulab
--

CREATE TABLE public."Entregan" (
    clave integer NOT NULL,
    rfc character varying(15) NOT NULL,
    numero integer NOT NULL,
    fecha date NOT NULL,
    cantidad integer NOT NULL
);

--
-- TOC entry 219 (class 1259 OID 24603)
-- Name: Materiales; Type: TABLE; Schema: public; Owner: ulab
--

CREATE TABLE public."Materiales" (
    clave integer NOT NULL,
    descripcion character varying(40) NOT NULL,
    precio numeric NOT NULL,
    impuesto numeric NOT NULL
);

--
-- TOC entry 220 (class 1259 OID 24612)
-- Name: Proveedores; Type: TABLE; Schema: public; Owner: ulab
--

CREATE TABLE public."Proveedores" (
    rfc character varying(15) NOT NULL,
    razonsocial character varying(40) NOT NULL
);

--
-- TOC entry 221 (class 1259 OID 24617)
-- Name: Proyectos; Type: TABLE; Schema: public; Owner: ulab
--

CREATE TABLE public."Proyectos" (
    numero integer NOT NULL,
    denominacion character varying(40) NOT NULL
);





--
-- TOC entry 4870 (class 2606 OID 24641)
-- Name: Entregan Entregan_pkey; Type: CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Entregan"
    ADD CONSTRAINT "Entregan_pkey" PRIMARY KEY (clave, rfc, numero, fecha);


--
-- TOC entry 4864 (class 2606 OID 24623)
-- Name: Materiales Materiales_pkey; Type: CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Materiales"
    ADD CONSTRAINT "Materiales_pkey" PRIMARY KEY (clave);


--
-- TOC entry 4866 (class 2606 OID 24625)
-- Name: Proveedores Proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Proveedores"
    ADD CONSTRAINT "Proveedores_pkey" PRIMARY KEY (rfc);


--
-- TOC entry 4868 (class 2606 OID 24627)
-- Name: Proyectos Proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Proyectos"
    ADD CONSTRAINT "Proyectos_pkey" PRIMARY KEY (numero);


--
-- TOC entry 4871 (class 2606 OID 24652)
-- Name: Entregan clave; Type: FK CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Entregan"
    ADD CONSTRAINT clave FOREIGN KEY (clave) REFERENCES public."Materiales"(clave) NOT VALID;


--
-- TOC entry 4872 (class 2606 OID 24647)
-- Name: Entregan numero_fk; Type: FK CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Entregan"
    ADD CONSTRAINT numero_fk FOREIGN KEY (numero) REFERENCES public."Proyectos"(numero) NOT VALID;


--
-- TOC entry 4873 (class 2606 OID 24642)
-- Name: Entregan rfc_fk; Type: FK CONSTRAINT; Schema: public; Owner: ulab
--

ALTER TABLE ONLY public."Entregan"
    ADD CONSTRAINT rfc_fk FOREIGN KEY (rfc) REFERENCES public."Proveedores"(rfc) NOT VALID;


-- Completed on 2026-04-20 21:41:06

--
-- PostgreSQL database dump complete
--
