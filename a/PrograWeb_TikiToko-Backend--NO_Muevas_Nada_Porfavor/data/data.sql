--
-- PostgreSQL database dump
--

\restrict D5OhlRB74RgsKT33xTCN2KVlcPlIRSoCVdrMOuviZkmdvf1xIXi2ef86hFnUgoD

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-01 22:03:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4997 (class 0 OID 16775)
-- Dependencies: 221
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: tikitoko_user
--

INSERT INTO public."User" VALUES (1, 'Diana Condor', 'diana', 'diana@example.com', '123456', '2000-01-01', NULL, 100, true, NULL, 'data:image/png;base64,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', '', '{"privacy": {"showActivity": true, "allowMessages": true, "privateAccount": false}, "notifications": {"likes": true, "comments": true, "newFollowers": true}}', 'dark', '2025-12-01 14:55:35.745');


--
-- TOC entry 5003 (class 0 OID 16830)
-- Dependencies: 227
-- Data for Name: CommunityMember; Type: TABLE DATA; Schema: public; Owner: tikitoko_user
--



--
-- TOC entry 4999 (class 0 OID 16796)
-- Dependencies: 223
-- Data for Name: Stream; Type: TABLE DATA; Schema: public; Owner: tikitoko_user
--



--
-- TOC entry 5001 (class 0 OID 16815)
-- Dependencies: 225
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: tikitoko_user
--



--
-- TOC entry 4995 (class 0 OID 16723)
-- Dependencies: 219
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: tikitoko_user
--

INSERT INTO public._prisma_migrations VALUES ('406a86b1-5958-4981-ac28-84faa770d72c', '66ca40d2ed58402c5a895da6fc395365d2cab095699d474243b93894ef000013', '2025-12-01 14:33:04.408707-05', '20251113015728_init', NULL, NULL, '2025-12-01 14:33:04.398264-05', 1);
INSERT INTO public._prisma_migrations VALUES ('ebb71061-7026-486c-ad13-17df6a07604a', '8ba66d0820acd63008b865c9f24e07a0e1f9ca34b1a2c070d888af2aee337665', '2025-12-01 14:33:04.419205-05', '20251113235617_hola', NULL, NULL, '2025-12-01 14:33:04.409269-05', 1);
INSERT INTO public._prisma_migrations VALUES ('6bf64e07-a242-4388-80b1-49712e496d45', 'd80b6d3fe839130066b4518059d442d41c7456a9ccc378cb3b13192c4a01f29e', '2025-12-01 14:33:04.423287-05', '20251116052041_add_user_model_coins', NULL, NULL, '2025-12-01 14:33:04.419909-05', 1);
INSERT INTO public._prisma_migrations VALUES ('d5d3288e-e108-49d5-bfbf-d423659830e8', '5be093d6456e521ee3d479e6a58c75c93b672223dc9978fa65ec4c1dcf12c31d', '2025-12-01 14:33:04.455598-05', '20251201041948_tablas_definitivas', NULL, NULL, '2025-12-01 14:33:04.424073-05', 1);
INSERT INTO public._prisma_migrations VALUES ('b3f35aab-93fc-47ea-b94d-4a2d9f9940b9', 'f655f14816708d68cd18faf82734fc156aacf1ca484f9c786eceb837cd1944dd', '2025-12-01 14:33:04.458883-05', '20251201060916_agregar_campos_configuracion', NULL, NULL, '2025-12-01 14:33:04.4562-05', 1);
INSERT INTO public._prisma_migrations VALUES ('9059943a-f6e7-44c8-9414-4c71a1eccea4', 'ba36010371a05a77e11974d5c633c5636d2efb2cbf971c49b3161f668480e862', '2025-12-01 14:55:14.679554-05', '20251201195514_map_created_at_user', NULL, NULL, '2025-12-01 14:55:14.669287-05', 1);


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 226
-- Name: CommunityMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tikitoko_user
--

SELECT pg_catalog.setval('public."CommunityMember_id_seq"', 1, false);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 224
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tikitoko_user
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 222
-- Name: Stream_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tikitoko_user
--

SELECT pg_catalog.setval('public."Stream_id_seq"', 1, false);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 220
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tikitoko_user
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


-- Completed on 2025-12-01 22:03:41

--
-- PostgreSQL database dump complete
--

\unrestrict D5OhlRB74RgsKT33xTCN2KVlcPlIRSoCVdrMOuviZkmdvf1xIXi2ef86hFnUgoD

