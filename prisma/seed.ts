import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const chainingTypes = [
	{
		chain: "unclosed",
		selector: "/>",
		messageCode: "unclosed element",
		invalidation: "x$"
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
		selector: "[",
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
		invalidation: "$x"
	},
	{
		chain: "content",
		selector: "content",
		messageCode: "end of file seen without seeing a doctype first. expected",
		invalidation: "$x"
	},
	{
		chain: "undefined",
		selector: "undefined",
		messageCode: "undefined",
		invalidation: "$x"
	}
];

const ruleTypes = [
	{
		code: "error",
		type: "Erro",
		diagnostic: 0,
		visible: true
	},
	{
		code: "info",
		type: "Informação",
		diagnostic: 1,
		visible: true
	},
];

export const load = async () => {
  try {
	await prisma.rule.deleteMany();
	await prisma.ruleType.deleteMany();
	ruleTypes.forEach(async ruleType =>{
		await prisma.ruleType.create({
			data: ruleType
		});
	});
	console.log('Added ruleTypes data');
	await prisma.chainingType.deleteMany();
	chainingTypes.forEach(async chainingType => {
		await prisma.chainingType.create({
		  data: chainingType
		});
	});
    console.log('Added chainingTypes data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();