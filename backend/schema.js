const userSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "email", "password", "role"],
    properties: {
      name: {
        bsonType: "string",
        description: "User's full name"
      },
      email: {
        bsonType: "string",
        description: "User's email address"
      },
      password: {
        bsonType: "string",
        description: "Hashed password"
      },
      role: {
        enum: ["user", "bug-creator"],
        description: "User role"
      },
      balance: {
        bsonType: "number",
        minimum: 0,
        description: "User's balance"
      },
      createdAt: {
        bsonType: "date",
        description: "Creation timestamp"
      },
      updatedAt: {
        bsonType: "date",
        description: "Update timestamp"
      }
    }
  }
};

const bugSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "description", "bountyAmount", "status", "createdBy"],
    properties: {
      title: {
        bsonType: "string",
        description: "Bug title"
      },
      description: {
        bsonType: "string",
        description: "Bug description"
      },
      bountyAmount: {
        bsonType: "number",
        minimum: 0,
        description: "Bounty amount"
      },
      isConfigurable: {
        bsonType: "bool",
        description: "Whether the bug is configurable"
      },
      status: {
        enum: ["Open", "In Review", "Closed"],
        description: "Bug status"
      },
      createdBy: {
        bsonType: "objectId",
        description: "Reference to User who created the bug"
      },
      createdAt: {
        bsonType: "date",
        description: "Creation timestamp"
      },
      updatedAt: {
        bsonType: "date",
        description: "Update timestamp"
      }
    }
  }
};

const submissionSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["description", "proof", "bugId", "submittedBy"],
    properties: {
      description: {
        bsonType: "string",
        description: "Submission description"
      },
      proof: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["path", "type", "originalName"],
          properties: {
            path: {
              bsonType: "string",
              description: "File path"
            },
            type: {
              enum: ["image", "video", "file"],
              description: "File type"
            },
            originalName: {
              bsonType: "string",
              description: "Original file name"
            }
          }
        },
        description: "Array of proof files"
      },
      bugId: {
        bsonType: "objectId",
        description: "Reference to Bug"
      },
      submittedBy: {
        bsonType: "objectId",
        description: "Reference to User who submitted"
      },
      winner: {
        bsonType: "bool",
        description: "Whether this submission is the winner"
      },
      createdAt: {
        bsonType: "date",
        description: "Creation timestamp"
      },
      updatedAt: {
        bsonType: "date",
        description: "Update timestamp"
      }
    }
  }
};

module.exports = {
  userSchema,
  bugSchema,
  submissionSchema
};
