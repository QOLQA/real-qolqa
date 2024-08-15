const data = [
  {
    "collections": [
      {
        "name": "security",
        "id": "cd83409e-5ced-4f4e-9a71-a4838cd22ba2",
        "fields": {
          "maintain": "behavior",
          "couple": "imagine",
          "my": "everything"
        },
        "position": {
          "x": 14,
          "y": 30
        },
        "nested_docs": [
          {
            "name": "together",
            "fields": {
              "part": "woman",
              "design": "line"
            },
            "nested_docs": null,
            "id": "feecea76-5333-4d9f-9890-53ffc3bb233e",
            "cardinality": "1..1"
          }
        ]
      },
      {
        "name": "president",
        "id": "9ae0b660-486f-4e92-aa76-77f9b5d1c7f0",
        "fields": {
          "tree": "actually",
          "continue": "situation",
          "democratic": "growth"
        },
        "position": {
          "x": 30,
          "y": 310
        },
        "nested_docs": [
          {
            "name": "young",
            "fields": {
              "rock": "serve",
              "new": "person"
            },
            "nested_docs": [
              {
                "name": "dasdf",
                "fields": {
                  "id_column1": "String"
                },
                "nested_docs": null,
                "id": "ff79504a-2b18-4659-9742-8825248a3036",
                "cardinality": "1..1"
              }
            ],
            "id": "02daee68-8347-40b2-b20b-9b4842f45a73",
            "cardinality": "1..1"
          },
          {
            "name": "exist",
            "fields": {
              "hope": "or",
              "throw": "skin"
            },
            "nested_docs": null,
            "id": "67fed7da-0023-4d6e-b2ad-a9f757dd9fd5",
            "cardinality": "1..1"
          }
        ]
      },
      {
        "name": "bed",
        "id": "874f2d48-81b3-4d2e-884b-5a9159107bd0",
        "fields": {
          "here": "important",
          "sign": "what",
          "cultural": "name"
        },
        "position": {
          "x": 330,
          "y": 90
        },
        "nested_docs": [
          {
            "name": "when",
            "fields": {
              "today": "by",
              "general": "notice"
            },
            "nested_docs": null,
            "id": "004e88db-7771-49d4-a257-6b61b5ae4454",
            "cardinality": "1..1"
          },
          {
            "name": "effect",
            "fields": {
              "born": "people",
              "series": "phone"
            },
            "nested_docs": null,
            "id": "579359bd-2ab1-465b-89a0-f659dc30513e",
            "cardinality": "1..1"
          }
        ]
      }
    ],
    "relations": [
      {
        "id_source": "cd83409e-5ced-4f4e-9a71-a4838cd22ba2",
        "id_target": "9ae0b660-486f-4e92-aa76-77f9b5d1c7f0",
        "cardinality": "n..1"
      },
      {
        "id_source": "9ae0b660-486f-4e92-aa76-77f9b5d1c7f0",
        "id_target": "874f2d48-81b3-4d2e-884b-5a9159107bd0",
        "cardinality": "1..1"
      }
    ]
  },
  {
    "collections": [
      {
        "name": "can",
        "id": "90fb7190-b4e5-4952-9412-63485d2d6f59",
        "fields": {
          "special": "meet",
          "politics": "tree",
          "agency": "within"
        },
        "position": {
          "x": 650,
          "y": 50
        },
        "nested_docs": [
          {
            "name": "international",
            "fields": {
              "director": "another",
              "carry": "guy"
            },
            "nested_docs": null,
            "id": "5d813e38-afe9-4317-906e-038efdd7eb86",
            "cardinality": "1..1"
          }
        ]
      },
      {
        "name": "girl",
        "id": "ece5cddc-3df3-4048-b349-ea75a4be19c7",
        "fields": {
          "people": "fire",
          "age": "factor",
          "provide": "born"
        },
        "position": {
          "x": 640,
          "y": 320
        },
        "nested_docs": [
          {
            "name": "impact",
            "fields": {
              "test": "glass",
              "push": "more"
            },
            "nested_docs": null,
            "id": "898c82d6-81d8-42cd-a3fc-822058f47bc6",
            "cardinality": "1..1"
          },
          {
            "name": "what",
            "fields": {
              "itself": "arm",
              "close": "situation"
            },
            "nested_docs": null,
            "id": "d347c5b5-7034-41f1-8310-7e57cc10b096",
            "cardinality": "1..1"
          }
        ]
      }
    ],
    "relations": [
      {
        "id_source": "90fb7190-b4e5-4952-9412-63485d2d6f59",
        "id_target": "ece5cddc-3df3-4048-b349-ea75a4be19c7",
        "cardinality": "n..1"
      }
    ]
  },
  {
    "collections": [
      {
        "name": "long",
        "id": "47544c0b-c674-433f-bcd1-9abae082c224",
        "fields": {
          "from": "light",
          "simply": "available",
          "six": "Mr"
        },
        "position": {
          "x": 960,
          "y": 40
        },
        "nested_docs": [
          {
            "name": "ground",
            "fields": {
              "everything": "finish",
              "space": "list"
            },
            "nested_docs": null,
            "id": "57984a0a-7eac-46cb-8246-41f756ee93ff",
            "cardinality": "1..1"
          },
          {
            "name": "nice",
            "fields": {
              "ball": "item",
              "member": "evidence"
            },
            "nested_docs": null,
            "id": "942fffa1-1c23-4f51-8759-88db775d6b99",
            "cardinality": "1..1"
          }
        ]
      },
      {
        "name": "we",
        "id": "f74ad273-0ae2-45b8-b3fc-070194716ed1",
        "fields": {
          "paper": "food",
          "go": "cultural",
          "across": "green"
        },
        "position": {
          "x": 940,
          "y": 380
        },
        "nested_docs": [
          {
            "name": "show",
            "fields": {
              "white": "but",
              "would": "memory"
            },
            "nested_docs": null,
            "id": "731ea32d-9f3e-4217-8068-2661ece5531d",
            "cardinality": "1..1"
          },
          {
            "name": "evening",
            "fields": {
              "nation": "say",
              "area": "fill"
            },
            "nested_docs": null,
            "id": "dad348fe-7481-42fb-8949-265841f9e282",
            "cardinality": "1..1"
          }
        ]
      }
    ],
    "relations": [
      {
        "id_source": "47544c0b-c674-433f-bcd1-9abae082c224",
        "id_target": "f74ad273-0ae2-45b8-b3fc-070194716ed1",
        "cardinality": "n..1"
      }
    ]
  },
  {
    "collections": [
      {
        "name": "task",
        "id": "f67aa25b-7db5-4709-96c6-8b3e81f61300",
        "fields": {
          "blood": "dog",
          "involve": "where",
          "week": "have"
        },
        "position": {
          "x": 360,
          "y": 450
        },
        "nested_docs": [
          {
            "name": "reach",
            "fields": {
              "thank": "send",
              "space": "describe"
            },
            "nested_docs": null,
            "id": "7691d255-ccf4-4f67-bb8e-5446e83a094c",
            "cardinality": "1..1"
          }
        ]
      }
    ],
    "relations": null
  }
];

const countRelation = (relation, idCount, cantRelation, idKey) => {
  const { id_source, id_target } = relation;

  idCount[id_source] = (idCount[id_source] || 0) + 1;
  idCount[id_target] = (idCount[id_target] || 0) + 1;

  if (idCount[id_source] > cantRelation) {
    cantRelation = idCount[id_source];
    idKey = id_source;
  }

  if (idCount[id_target] > cantRelation) {
    cantRelation = idCount[id_target];
    idKey = id_target;
  }


  return { idCount, cantRelation, idKey };
}

const maxDepth = (docs) => {
  if (!docs || docs.length === 0) {
    return 0;
  }

  let max = 0;

  docs.forEach(doc => {
    const depth = maxDepth(doc.nested_docs);
    if (depth > max) {
      max = depth;
    }
  });

  return max + 1;
};

const countIds = (submodels) => {
  let idCount = {};
  let cantRelation = 0;
  let idKey;
  let maxNestedDocs = 0;

  submodels.forEach(model => {
    const { relations, collections } = model;

    if (relations != null) {
      relations.forEach(relation => {
        const result = countRelation(relation, idCount, cantRelation, idKey);
        idCount = result.idCount;
        cantRelation = result.cantRelation;
        idKey = result.idKey;
      });
    }

    let max = maxDepth(collections);
    if (max > maxNestedDocs) {
      maxNestedDocs = max
    }
  });

  return { idCount, cantRelation, idKey, maxNestedDocs };
};

const patronAcceso = (data, cof_1 = 0.4, cof_2 = 0.6) =>
  (data.maxNestedDocs * cof_1 + data.cantRelation * cof_2);

const result = countIds(data);
console.log(`ID Count: ${result.idCount}`);
console.log(`Cantidad de relaciones: ${result.cantRelation}`);
console.log(`ID con mayor número de apariciones: ${result.idKey}`);
console.log(`ID con mayor número de anidados: ${result.maxNestedDocs}`);
console.log(`Métrica: ${patronAcceso({ ...result })}`);
