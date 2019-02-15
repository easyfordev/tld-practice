/**
 * @licence app begin@
 * Copyright (C) 2011-2012  BMW AG
 *
 * This file is part of GENIVI Project Dlt Viewer.
 *
 * Contributions are licensed to the GENIVI Alliance under one or more
 * Contribution License Agreements.
 *
 * \copyright
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a  copy of the MPL was not distributed with
 * this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * \file treemodel.cpp
 * For further information see http://www.genivi.org/.
 * @licence end@
 */

#include <QtGui>
#include <QApplication>
#include <qmessagebox.h>
#include <QTextEdit>

#include "tablemodel.h"
#include "fieldnames.h"
#include "dltsettingsmanager.h"
#include "dltuiutils.h"
#include "optmanager.h"
#include "dlt_protocol.h"

//#include <fstream>
//#include <string>
//#include <iostream>
//#include <QFileInfo>

#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QTextStream>

static int lastrow = -1; // necessary because object tablemodel can not be changed, so no member variable can be used
char buffer[DLT_VIEWER_LIST_BUFFER_SIZE];


void getmessage( int indexrow, long int filterposindex, unsigned int* decodeflag, QDltMsg* msg, QDltMsg* lastmsg, QDltFile* qfile, bool* success )
{
 if ( indexrow == lastrow)
 {
  *msg = *lastmsg;
 }
 else
 {
  *success = qfile->getMsg(filterposindex, *msg);
  *lastmsg = *msg;
  *decodeflag = 1;
 }
 if ( indexrow == 0)
 {
  lastrow = 0;
 }
 else
 {
  lastrow = indexrow;
 }

}

TableModel::TableModel(const QString & /*data*/, QObject *parent)
     : QAbstractTableModel(parent)
 {
     qfile = NULL;
     project = NULL;
     pluginManager = NULL;
     lastSearchIndex = -1;
     emptyForceFlag = false;
     loggingOnlyMode = false;
     lastrow = -1;

     /* Modified by Yiji Choi from here */
     QString content;
     QFile file("../../dlt-viewer/hmc_dltviewlogconfig.ini");

     if (file.open(QIODevice::ReadOnly)) { // If congif file exists,
         QTextStream stream(&file);
         for(int i=0;i<3;i++){
             QString subtype, color;
             QStringList list;
             content = stream.readLine();
             list = content.split(' ');

             if(list[0] == "info"){
                 infoColor = list[1];
             } else if(list[0] == "warn"){
                 warnColor = list[1];
             } else if(list[0] == "error"){
                 errorColor = list[1];
             }
         }
     } else { // Else if config file does not exist, set default value
         infoColor = "#000000";
         warnColor = "#000000";
         errorColor = "#000000";
    }

 }

 TableModel::~TableModel()
 {

 }

 int TableModel::columnCount(const QModelIndex & /*parent*/) const
 {
     return DLT_VIEWER_COLUMN_COUNT+project->settings->showArguments;
 }

 QVariant TableModel::data(const QModelIndex &index, int role) const
 {
     QByteArray buf;
     static QDltMsg msg;
     static QDltMsg lastmsg;
     static QDltMsg last_decoded_msg;
     static unsigned int decodeflag = 0;
     static bool success = true;

     long int filterposindex = 0;


     if (index.isValid() == false)
     {
         return QVariant();
     }

     if (index.row() >= qfile->sizeFilter() && index.row()<0)
     {
         return QVariant();
     }

     filterposindex = qfile->getMsgFilterPos(index.row());

     if (role == Qt::DisplayRole)
     {
         /* get the message with the selected item id */
         if(true == loggingOnlyMode)
         {
             msg = QDltMsg();
         }
         else /* get the message with the selected item id */
         {
           getmessage( index.row(), filterposindex, &decodeflag, &msg, &lastmsg, qfile, &success);

           if ( success == false )
           {
             if(index.column() == FieldNames::Index)
             {
                 return QString("%1").arg(qfile->getMsgFilterPos(index.row()));
             }
             else if(index.column() == FieldNames::Payload)
             {
                 return QString("!!CORRUPTED MESSAGE!!");
             }
             return QVariant();
          }
         }

         if((DltSettingsManager::getInstance()->value("startup/pluginsEnabled", true).toBool()))
         {
             if ( decodeflag == 1 )
              {
               decodeflag = 0;
               last_decoded_msg = msg;
               pluginManager->decodeMsg(msg,!OptManager::getInstance()->issilentMode());
               last_decoded_msg = msg;
              }
              else
              {
                msg = last_decoded_msg;
              }
         }

         /*
          * Modified by Yiji Choi from here *
                                            */
         QString log_level = msg.getSubtypeString();
         int flag = 0;

         if(log_level == QString("info")){
             flag = 1;
         } else if(log_level == QString("warn")){
             flag = 2;
         } else if(log_level == QString("error")){
             flag = 3;
         }

         switch(index.column())
         {
         case FieldNames::Index:
             /* display index */
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(qfile->getMsgFilterPos(index.row())).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(qfile->getMsgFilterPos(index.row())).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(qfile->getMsgFilterPos(index.row())).arg(errorColor);
             } else {
                 return QString("%L1").arg(qfile->getMsgFilterPos(index.row()));
             }
         case FieldNames::Time:
             if(flag == 1){
                 if( project->settings->automaticTimeSettings == 0 ){
                     return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getGmTimeWithOffsetString(project->settings->utcOffset,project->settings->dst)).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(infoColor);;
                 } else
                    return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimeString()).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(infoColor);;
                 //return QString("<span style=\" color:#00a000;\">%L1</span>").arg(qfile->getMsgFilterPos(index.row()));
             } else if(flag == 2){
                 if( project->settings->automaticTimeSettings == 0 ){
                     return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getGmTimeWithOffsetString(project->settings->utcOffset,project->settings->dst)).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(warnColor);;
                 } else
                    return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimeString()).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(warnColor);;
             } else if(flag == 3){
                 if( project->settings->automaticTimeSettings == 0 ){
                     return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getGmTimeWithOffsetString(project->settings->utcOffset,project->settings->dst)).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(errorColor);;
                 } else
                    return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimeString()).arg(msg.getMicroseconds(),6,10,QLatin1Char('0')).arg(errorColor);;
             } else {
                 if( project->settings->automaticTimeSettings == 0 ){
                     return QString("%1.%2").arg(msg.getGmTimeWithOffsetString(project->settings->utcOffset,project->settings->dst)).arg(msg.getMicroseconds(),6,10,QLatin1Char('0'));
                 }else
                    return QString("%1.%2").arg(msg.getTimeString()).arg(msg.getMicroseconds(),6,10,QLatin1Char('0'));
             }
         case FieldNames::TimeStamp:
             if(flag == 1){
                 return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimestamp()/10000).arg(msg.getTimestamp()%10000,4,10,QLatin1Char('0')).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimestamp()/10000).arg(msg.getTimestamp()%10000,4,10,QLatin1Char('0')).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%3;\">%1.%2</span>").arg(msg.getTimestamp()/10000).arg(msg.getTimestamp()%10000,4,10,QLatin1Char('0')).arg(errorColor);
             } else {
                 return QString("%1.%2").arg(msg.getTimestamp()/10000).arg(msg.getTimestamp()%10000,4,10,QLatin1Char('0'));
             }
         case FieldNames::Counter:
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getMessageCounter()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getMessageCounter()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getMessageCounter()).arg(errorColor);
             } else {
                 return QString("%1").arg(msg.getMessageCounter());
             }
         case FieldNames::EcuId:
             //return msg.getEcuid();
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getEcuid()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getEcuid()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getEcuid()).arg(errorColor);
             } else {
                return msg.getEcuid();
             }
         case FieldNames::AppId:
             switch(project->settings->showApIdDesc)
             {
             case 0:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(errorColor);
                 } else {
                    return msg.getApid();
                 }
                 break;
                // return msg.getApid();
             case 1:
                   for(int num = 0; num < project->ecu->topLevelItemCount (); num++)
                    {
                     EcuItem *ecuitem = (EcuItem*)project->ecu->topLevelItem(num);
                     for(int numapp = 0; numapp < ecuitem->childCount(); numapp++)
                     {
                         ApplicationItem * appitem = (ApplicationItem *) ecuitem->child(numapp);
                         if(appitem->id == msg.getApid() && !appitem->description.isEmpty())
                         {
                             if(flag == 1){
                                 return QString("<span style=\" color:%2;\">%1</span>").arg(appitem->description).arg(infoColor);
                             } else if(flag == 2){
                                 return QString("<span style=\" color:%2;\">%1</span>").arg(appitem->description).arg(warnColor);
                             } else if(flag == 3){
                                 return QString("<span style=\" color:%2;\">%1</span>").arg(appitem->description).arg(errorColor);
                             } else {
                                 return appitem->description;
                             }
                            //return appitem->description;
                         }
                     }
                    } // end of for

                   if(flag == 1){
                       return QString("<span style=\" color:%2;\">Apid: %1 (No description)</span>").arg(msg.getApid()).arg(infoColor);
                   } else if(flag == 2){
                       return QString("<span style=\" color:%2;\">Apid: %1 (No description)</span>").arg(msg.getApid()).arg(warnColor);
                   } else if(flag == 3){
                       return QString("<span style=\" color:%2;\">Apid: %1 (No description)</span>").arg(msg.getApid()).arg(errorColor);
                   } else {
                       return QString("Apid: %1 (No description)").arg(msg.getApid());
                   }
                 break;
              default:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getApid()).arg(errorColor);
                 } else {
                    return msg.getApid();
                 }
                 //return msg.getApid();
             }
         case FieldNames::ContextId:
             switch(project->settings->showCtIdDesc)
             {
             case 0:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(errorColor);
                 } else {
                    return msg.getCtid();
                 }
                 //return msg.getCtid();
                 break;
             case 1:
                   for(int num = 0; num < project->ecu->topLevelItemCount (); num++)
                    {
                     EcuItem *ecuitem = (EcuItem*)project->ecu->topLevelItem(num);
                     for(int numapp = 0; numapp < ecuitem->childCount(); numapp++)
                     {
                         ApplicationItem * appitem = (ApplicationItem *) ecuitem->child(numapp);
                         for(int numcontext = 0; numcontext < appitem->childCount(); numcontext++)
                         {
                             ContextItem * conitem = (ContextItem *) appitem->child(numcontext);

                             if(appitem->id == msg.getApid() && conitem->id == msg.getCtid()
                                     && !conitem->description.isEmpty())
                             {
                                return conitem->description;
                             }
                         }
                     }
                    }
                   if(flag == 1){
                       return QString("<span style=\" color:%2;\">Ctid: %1 (No description)</span>").arg(msg.getCtid()).arg(infoColor);
                   } else if(flag == 2){
                       return QString("<span style=\" color:%2;\">Ctid: %1 (No description)</span>").arg(msg.getCtid()).arg(warnColor);
                   } else if(flag == 3){
                       return QString("<span style=\" color:%2;\">Ctid: %1 (No description)</span>").arg(msg.getCtid()).arg(errorColor);
                   } else {
                      return  QString("Ctid: %1 (No description)").arg(msg.getCtid());
                   }
                 break;
              default:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getCtid()).arg(errorColor);
                 } else {
                    return msg.getCtid();
                 }
             }
         case FieldNames::SessionId:
             switch(project->settings->showSessionName){
             case 0:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(errorColor);
                 } else {
                     return QString("%1").arg(msg.getSessionid());
                 }
                 break;
             case 1:
                 if(!msg.getSessionName().isEmpty())
                 {
                     if(flag == 1){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionName()).arg(infoColor);
                     } else if(flag == 2){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionName()).arg(warnColor);
                     } else if(flag == 3){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionName()).arg(errorColor);
                     } else {
                         return QString("%1").arg(msg.getSessionName());
                     }
                   // return msg.getSessionName();
                 }
                else
                 {
                     if(flag == 1){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(infoColor);
                     } else if(flag == 2){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(warnColor);
                     } else if(flag == 3){
                         return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(errorColor);
                     } else {
                         return QString("%1").arg(msg.getSessionid());
                     }
                    //return QString("%1").arg(msg.getSessionid());
                 }
                 break;
              default:
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSessionid()).arg(errorColor);
                 } else {
                     return QString("%1").arg(msg.getSessionid());
                 }
             }
         case FieldNames::Type:
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getTypeString()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getTypeString()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getTypeString()).arg(errorColor);
             } else {
                return msg.getTypeString();
             }
             //return msg.getTypeString();
         case FieldNames::Subtype:
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSubtypeString()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSubtypeString()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getSubtypeString()).arg(errorColor);
             } else {
                return msg.getSubtypeString();
             }
         case FieldNames::Mode:
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getModeString()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getModeString()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getModeString()).arg(errorColor);
             } else {
                return msg.getModeString();
             }
         case FieldNames::ArgCount:
             if(flag == 1){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getNumberOfArguments()).arg(infoColor);
             } else if(flag == 2){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getNumberOfArguments()).arg(warnColor);
             } else if(flag == 3){
                 return QString("<span style=\" color:%2;\">%1</span>").arg(msg.getNumberOfArguments()).arg(errorColor);
             } else {
                 return QString("%1").arg(msg.getNumberOfArguments());
             }
         case FieldNames::Payload:
             if( true == loggingOnlyMode)
             {
                 return QString("Logging only Mode! Disable in Project Settings!");
             }
             else{
                 if(flag == 1){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.toStringPayload()).arg(infoColor);
                 } else if(flag == 2){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.toStringPayload()).arg(warnColor);
                 } else if(flag == 3){
                     return QString("<span style=\" color:%2;\">%1</span>").arg(msg.toStringPayload()).arg(errorColor);
                 } else {
                     return msg.toStringPayload();
                 }
             }
             /* display payload */

         default:
             if (index.column()>=FieldNames::Arg0)
             {
                 int col=index.column()-FieldNames::Arg0; //arguments a zero based
                 QDltArgument arg;
                 if (msg.getArgument(col,arg))
                 {
                     return arg.toString();
                 }
                 else
                 {
                  return QString(" - ");
                 }

             }
         }
         /* End of modification */
     }

     if ( role == Qt::ForegroundRole )
     {
         getmessage( index.row(), filterposindex, &decodeflag, &msg, &lastmsg, qfile, &success); // version2

         // Color the last search row
         if(lastSearchIndex != -1 && filterposindex == qfile->getMsgFilterPos(lastSearchIndex))
         {
             return QVariant(QBrush(DltUiUtils::optimalTextColor(searchBackgroundColor())));
             //return QVariant(QBrush(Qt::yellow));
         }
         else if (QColor(qfile->checkMarker(msg)).isValid())
         {
           QColor color = qfile->checkMarker(msg);
           return QVariant(QBrush(DltUiUtils::optimalTextColor(color)));
           //return QVariant(QBrush(DltUiUtils::optimalTextColor(Qt::yellow)));
         }
         else if(project->settings->autoMarkFatalError && !QColor(qfile->checkMarker(msg)).isValid() && ( msg.getSubtypeString() == "error" || msg.getSubtypeString() == "fatal")  )
         {
            return QVariant(QBrush(QColor(255,255,255)));
         }
         else
         {
             return QVariant(QBrush(QColor(0,0,0)));
            // return QVariant(QBrush(QColor(255,1,1)));
         }
     }

     if ( role == Qt::BackgroundRole )
     {
         getmessage( index.row(), filterposindex, &decodeflag, &msg, &lastmsg, qfile, &success); // version2

         if((DltSettingsManager::getInstance()->value("startup/pluginsEnabled", true).toBool()))
         {
             if ( decodeflag == 1 )
              {
               decodeflag = 0;
               last_decoded_msg = msg;
               pluginManager->decodeMsg(msg,!OptManager::getInstance()->issilentMode());
               last_decoded_msg = msg;
              }
              else
              {
                msg = last_decoded_msg;
              }
         }

         QColor color = qfile->checkMarker(msg);
         if(color.isValid())
         {
            return QVariant(QBrush(color));
         }
         else
         {
             if(project->settings->autoMarkFatalError && ( msg.getSubtypeString() == "error" || msg.getSubtypeString() == "fatal") )
             {
                return QVariant(QBrush(QColor(255,0,0)));
             }
             if(project->settings->autoMarkWarn && msg.getSubtypeString() == "warn")
             {
                return QVariant(QBrush(QColor(255,255,0)));
             }
             if(project->settings->autoMarkMarker && msg.getType()==QDltMsg::DltTypeControl &&
                msg.getSubtype()==QDltMsg::DltControlResponse && msg.getCtrlServiceId() == DLT_SERVICE_ID_MARKER)
             {
                return QVariant(QBrush(QColor(0,255,0)));
             }

             return QVariant(QBrush(QColor(255,255,255)));
         }
     }

     if ( role == Qt::TextAlignmentRole )
     {
        switch(index.column())
        {
            case FieldNames::Index:
                return QVariant(Qt::AlignRight  | Qt::AlignVCenter);
            case FieldNames::Time:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::TimeStamp:
                return QVariant(Qt::AlignRight  | Qt::AlignVCenter);
            case FieldNames::Counter:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::EcuId:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::AppId:
                switch(project->settings->showApIdDesc)
                {
                case 0:
                    return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
                    break;
                case 1:
                    return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
                    break;
                default:
                    return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
                    break;
                }
            case FieldNames::ContextId:
                switch(project->settings->showCtIdDesc)
                {
                case 0:
                    return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
                    break;
                case 1:
                    return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
                    break;
                default:
                    return QVariant(Qt::AlignLeft | Qt::AlignVCenter);
                    break;
                }
            case FieldNames::Type:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::Subtype:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::Mode:
                return QVariant(Qt::AlignCenter | Qt::AlignVCenter);
            case FieldNames::ArgCount:
                return QVariant(Qt::AlignRight  | Qt::AlignVCenter);
            case FieldNames::Payload:
                return QVariant(Qt::AlignLeft   | Qt::AlignVCenter);
        }
    }

     return QVariant();
 }

QVariant TableModel::headerData(int section, Qt::Orientation orientation,
                                int role) const
{    
    if (orientation == Qt::Horizontal)
    {
        switch (role)
        {
        case Qt::DisplayRole:
            return FieldNames::getName((FieldNames::Fields)section, project->settings);
        case Qt::TextAlignmentRole:
            return (section == FieldNames::Payload) ? Qt::AlignLeft : QVariant();
         default:
            break;
        }
    }

    return QVariant();
}

 int TableModel::rowCount(const QModelIndex & /*parent*/) const
 {
     if(true == emptyForceFlag)
         return 0;
     else if(true == loggingOnlyMode)
         return 1;
     else{
         return qfile->sizeFilter();
     }

 }

 void TableModel::modelChanged()
 {
     if(true == emptyForceFlag)
     {
         index(0, 1);
         index(qfile->sizeFilter()-1, 0);
         index(qfile->sizeFilter()-1, columnCount() - 1);
     }
     else
     {
         index(0, 1);
         index(0, 0);
         index(0, columnCount() - 1);
     }
     lastrow = -1;
     emit(layoutChanged());
 }


QColor TableModel::searchBackgroundColor() const
{
    QString color = DltSettingsManager::getInstance()->value("other/searchResultColor", QString("#00AAFF")).toString();
    QColor hlColor(color);
    return hlColor;
}

void HtmlDelegate::paint(QPainter *painter, const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    QStyleOptionViewItem optionV4 = option;
    initStyleOption(&optionV4, index);

    QStyle *style = optionV4.widget? optionV4.widget->style() : QApplication::style();

    QTextDocument doc;
    doc.setHtml(optionV4.text);

    /// Painting item without text
    optionV4.text = QString();
    style->drawControl(QStyle::CE_ItemViewItem, &optionV4, painter);

    QAbstractTextDocumentLayout::PaintContext ctx;

    // Highlighting text if item is selected
    if (optionV4.state & QStyle::State_Selected)
        ctx.palette.setColor(QPalette::Text, optionV4.palette.color(QPalette::Active, QPalette::HighlightedText));

    QRect textRect = style->subElementRect(QStyle::SE_ItemViewItemText, &optionV4);
    painter->save();
    painter->translate(textRect.topLeft());
    painter->setClipRect(textRect.translated(-textRect.topLeft()));
    doc.documentLayout()->draw(painter, ctx);
    painter->restore();

}

QSize HtmlDelegate::sizeHint(const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    QStyleOptionViewItem optionV4 = option;
    initStyleOption(&optionV4, index);

    QTextDocument doc;
    doc.setHtml(optionV4.text);
    doc.setTextWidth(optionV4.rect.width());
    return QSize(doc.idealWidth(), doc.size().height());
}
