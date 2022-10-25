import {Sequelize, Model, DataTypes} from 'sequelize';
import sequelize from '../db';

export class ChainingType extends Model {
    declare id: Number;
    declare chain: string;
    declare messageCode: string;
    declare invalidation: string;

    getMessageCode(): string {
        return this.messageCode;
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
            messageCode: "unclosed element",
            invalidation: "$/>"
        },
        {
            chain: "headingEmpty",
            messageCode: "empty heading",
            invalidation: "x?"
        },
        {
            chain: "childrenNotAppear",
            messageCode: "must not appear as a descendant of the",
            invalidation: "y>x"
        },
        {
            chain: "childrenNotAllowed",
            messageCode: "not allowed as child of element",
            invalidation: "y>x"
        },
        {
            chain: "children",
            messageCode: "is missing a required instance of child element",
            invalidation: "x$>y"
        },
        {
            chain: "attributeEmpty",
            messageCode: "bad value “” for attribute",
            invalidation: "x$[y]"
        },
        {
            chain: "attributeShould",
            messageCode: "consider adding a",
            invalidation: "x$[y]"
        },
        {
            chain: "attributeOptional",
            messageCode: "attribute, except under certain conditions",
            invalidation: "x$[y]"
        },
        {
            chain: "attribute",
            messageCode: "is missing required attribute",
            invalidation: "x$[y]"
        },
        {
            chain: "doctype",
            messageCode: "non-space characters found without seeing a doctype first",
            invalidation: "$x"
        },
        {
            chain: "except",
            messageCode: "except",
            invalidation: "$x"
        },
    ]);
  })();

