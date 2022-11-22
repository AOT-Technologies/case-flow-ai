"""This manages Application submission Data."""

from __future__ import annotations

from datetime import datetime

from flask_sqlalchemy import BaseQuery
from sqlalchemy import and_, func, or_
from sqlalchemy.sql.expression import text

from caseflow.models.case_events import CaseEvents

from .base_model import BaseModel
from .db import db
from sqlalchemy.orm import backref, relationship
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func

class Cases(BaseModel, db.Model):  # pylint: disable=too-many-public-methods
    """This class manages Cases against each form."""
    __tablename__ = "Cases"
    id = db.Column(db.Integer, primary_key=True)
    lobid = db.Column(db.Integer,  nullable=True)
    name = db.Column(db.String(100), nullable=True)
    desc = db.Column(db.String(100), nullable=True)
    statusid = db.Column(db.Integer,ForeignKey("CaseStatuses.id"), nullable=True)
    typeid = db.Column(db.Integer,ForeignKey("CaseTypes.id"), nullable=True)
    linkedcases = db.Column(db.Integer, nullable=True)
    creationdate = db.Column(db.String(100), nullable=True)
    completiondate = db.Column(db.String(100), nullable=True)
    lastmodificationdate = db.Column(db.String(100), nullable=True)
    penduntildate = db.Column(db.String(100), nullable=True)
    archivedate = db.Column(db.String(100), nullable=True)
    startuserid = db.Column(db.Integer,ForeignKey("Person.id"), nullable=True)
    currentownerid = db.Column(db.Integer,ForeignKey("Person.id"), nullable=True)
    involvedparties = db.Column(db.Integer, nullable=True)   
    

    # docevent = relationship(
    #     CaseEvents, backref=backref("CaseEvents", uselist=True, cascade="delete,all")
    # )



 