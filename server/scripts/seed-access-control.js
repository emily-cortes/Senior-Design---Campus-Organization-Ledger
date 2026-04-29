require("dotenv").config();

const { seedAccessControl } = require("../data/access-control");

async function main() {
  const result = await seedAccessControl();
  console.log(
    `Seeded ${result.roleCount} role templates and ${result.assignmentCount} access assignments.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
