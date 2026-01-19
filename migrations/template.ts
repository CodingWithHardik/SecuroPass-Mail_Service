import { redis } from "..";

export default async (
  rdbTemplates: Array<any>,
  dbTemplate: Array<any>,
  dbRequirements: Array<any>,
) => {
  if (!rdbTemplates?.length) {
    for (const template of dbTemplate) {
      const dbRequirementsForTemplate = dbRequirements.find(
        (req) => req.emailId === template.id,
      );
      template.requirements = dbRequirementsForTemplate;
      await redis.set(
        `template:${template.templateid}`,
        JSON.stringify(template),
      );
    }
  } else {
    for (const template of dbTemplate) {
      const exists = await redis.exists(`template:${template.templateid}`);
      const dbRequirementsForTemplate = dbRequirements.filter(
        (req) => req.emailId === template.id,
      );
      template.requirements = dbRequirementsForTemplate;
      if (!exists) {
        await redis.set(
          `template:${template.templateid}`,
          JSON.stringify(template),
        );
      } else {
        const rdbTemplate = await redis.get(`template:${template.templateid}`);
        if (rdbTemplate) {
          const parsedRdbTemplate = JSON.parse(rdbTemplate);
          if (
            new Date(parsedRdbTemplate.updatedAt).getTime() !==
            new Date(template.updatedAt).getTime()
          ) {
            await redis.set(
              `template:${template.templateid}`,
              JSON.stringify(template),
            );
          }
        }
      }
    }
    for (const rdbTemplateKey of rdbTemplates) {
      const templateId = rdbTemplateKey.split(":")[1];
      const existsInDb = dbTemplate.find((t) => t.templateid === templateId);
      if (!existsInDb) {
        await redis.del(rdbTemplateKey);
      }
    }
  }
  return true;
};
