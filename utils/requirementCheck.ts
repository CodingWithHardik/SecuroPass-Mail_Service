export const requirementCheck = (message: any, template: any) => {
    if (!template.requirements || template.requirements.length === 0) return true;
    for (const requirement of  template.requirements) {
        const messageValue = message[requirement.name];
        if (messageValue === undefined || messageValue === null) return false;
        if (requirement.type === "STRING" && typeof messageValue !== "string") return false;
        if (requirement.type === "NUMBER" && typeof messageValue !== "number") return false;
        if (requirement.type === "BOOLEAN" && typeof messageValue !== "boolean") return false;
        return true;
    }
}