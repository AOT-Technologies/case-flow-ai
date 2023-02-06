CREATE TABLE case_documents (
    id serial4 NOT NULL,	
	caseId int8 NULL,
	documentref varchar NULL,
	"desc" text NULL,
	addedbyuserid varchar NULL,
	creationdate timestamptz NULL,
	dmsprovider int8 NULL,
	"name" varchar NULL,
	latestversion varchar NULL,
	isdeleted bool NULL,
	"type" varchar NULL,
	CONSTRAINT CaseDocuments_pkey PRIMARY KEY (id),
    
);
CREATE TABLE versions (
   id serial4 NOT NULL,
	docid int4 NULL,
	creationdate timestamp NULL,
	modificationdate timestamp NULL,
	documentid varchar NULL,
	versions int4 NULL,
	CONSTRAINT versions_pk PRIMARY KEY (id),
	CONSTRAINT versions_fk FOREIGN KEY (docid) REFERENCES case_documents(id)
);

