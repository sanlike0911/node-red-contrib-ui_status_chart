import { NodeDef } from "node-red";

declare namespace statusChart {
    interface appConfigBase {
        confsel: string;
        item: string;
        label: string;
        params: any;
        group: any;
        templateScope: string;
        width: number;
        height: number;
        tab: string;
        order: any;
        fwdInMessages?: any;
        storeOutMessages?: any;
    }

    type graphObject = {
        statusColor: string;
        statusValue: string;
        statusLabel: string;
    }
    
    interface statusColorListDef {
        [key: string]: string;
    }

    type graphDataObject = {
        datetime: Date;
        value: number | string;
        widthRatio: number;
        statusColor: string;
        label: string;
    }

    interface makeMsgBase {
        [key: string]: any;
        templateScope?: string;
        template?: string;
        graphObject?: graphObject[];
        graphData?: graphDataObject[];
    }
    interface nodeRedMsgBase {
        [key: string]: any;
        _msgid?: string;
        payload?: any;
        topic?: string;
    }

    interface nodeConf extends NodeDef, appConfigBase {}
    interface graphDataDef extends graphDataObject {}
    interface makeMegDef extends makeMsgBase, nodeRedMsgBase {}
    interface inputNodeMsgDef extends nodeRedMsgBase, graphDataObject {}

}

export default statusChart; 