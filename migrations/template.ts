import { redis_del, redis_exists, redis_get, redis_set } from "../utils/redis";

export default async (
  rdbTemplates: Array<any>,
  dbTemplate: Array<any>,
  dbRequirements: Array<any>,
) => {
  if (!rdbTemplates?.length) {
    for (const template of dbTemplate) {
      const dbRequirementsForTemplate = dbRequirements.filter(
        (req) => req.templateId === template.id,
      );
      template.requirements = dbRequirementsForTemplate;
      await redis_set(
        `template:${template.templateid}`,
        JSON.stringify(template),
      );
    }
  } else {
    for (const template of dbTemplate) {
      const exists = await redis_exists(`template:${template.templateid}`);
      const dbRequirementsForTemplate = dbRequirements.filter(
        (req) => req.templateId === template.id,
      );
      template.requirements = dbRequirementsForTemplate;
      if (!exists) {
        await redis_set(
          `template:${template.templateid}`,
          JSON.stringify(template),
        );
      } else {
        const rdbTemplate = await redis_get(`template:${template.templateid}`);
        if (rdbTemplate) {
          const parsedRdbTemplate = JSON.parse(rdbTemplate);
          if (
            new Date(parsedRdbTemplate.updatedAt).getTime() !==
            new Date(template.updatedAt).getTime()
          ) {
            await redis_set(`template:${template.templateid}`, JSON.stringify(template));
          }
        }
      }
    }
    for (const rdbTemplateKey of rdbTemplates) {
      const templateId = rdbTemplateKey.split(":")[1];
      const existsInDb = dbTemplate.filter((t) => t.templateid === templateId);
      if (!existsInDb) {
        await redis_del(rdbTemplateKey)
      }
    }
  }
  return true;
};
