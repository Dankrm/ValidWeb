import {Sequelize, Model, DataTypes} from 'sequelize';
import sequelize from '../db';

export class ChainingType extends Model {
    declare id: Number;
    declare chain: string;
    declare selector: string;
    declare messageCode: string;
    declare invalidation: string;

    getMessageCode(): string {
        return this.messageCode;
    }

    getSelector(): string {
        return this.selector;
    }
    
    getInvalidation(): string {
        return this.invalidation;
    }

    isAttribute (): boolean {
        return this.chain.includes('attribute');
    }
}
ChainingType.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    chain: DataTypes.TEXT,
    selector: DataTypes.TEXT,
    messageCode: DataTypes.TEXT,
    invalidation: DataTypes.TEXT
}, {sequelize});

(async () => {
    await ChainingType.destroy({
        where: {}
    });
    await sequelize.sync(); 
    await ChainingType.bulkCreate ([
        {
            chain: "unclosed",
            selector: "unclosed",
            messageCode: "unclosed element",
            invalidation: "$/>"
        },
        {
            chain: "emptyContent",
            selector: "content",
            messageCode: "empty heading",
            invalidation: "x$content"
        },
        {
            chain: "emptyContent",
            selector: "content",
            messageCode: "must not be empty",
            invalidation: "x$content"
        },
        {
            chain: "children",
            selector: ">",
            messageCode: "must not appear as a descendant of the",
            invalidation: "y>x"
        },
        {
            chain: "childrenNot",
            selector: ">",
            messageCode: "not allowed as child of element",
            invalidation: "y>x"
        },
        {
            chain: "children",
            selector: ">",
            messageCode: "is missing a required instance of child element",
            invalidation: "x$>y"
        },
        {
            chain: "language",
            selector: "language",
            messageCode: "start tag to declare the language of this document",
            invalidation: "y$[x]"
        },       
        {
            chain: "attributeEmpty",
            selector: "[",
            messageCode: "bad value “” for attribute",
            invalidation: "x$[y]"
        },
        {
            chain: "attribute",
            selector: "[",
            messageCode: "consider adding a",
            invalidation: "x$[y]"
        },
        {
            chain: "attribute",
            selector: "[",
            messageCode: "attribute, except under certain conditions",
            invalidation: "x$[y]"
        },
        {
            chain: "attribute",
            selector: "[",
            messageCode: "is missing required attribute",
            invalidation: "x$[y]"
        },
        {
            chain: "doctype",
            selector: "doctype",
            messageCode: "non-space characters found without seeing a doctype first",
            invalidation: "x$"
        },
        {
            chain: "doctype",
            selector: "doctype",
            messageCode: "end of file seen without seeing a doctype first. expected",
            invalidation: "$x"
        },
        {
            chain: "except",
            selector: "except",
            messageCode: "except",
            invalidation: "$x"
        },
    ]);
  })();

