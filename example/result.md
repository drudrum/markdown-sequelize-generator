## Model: parent
* id: integer
* name: string
* createdAt: date
* updatedAt: date
* children: [child[]](#model-child).



## Example of  parent
```
    {
      "id": 1,
      "name": "string",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "children": [
        {
          "id": 1,
          "name": "string",
          "birthday": "2015-12-31T23:59:59.123",
          "createdAt": "2015-12-31T23:59:59.123",
          "updatedAt": "2015-12-31T23:59:59.123",
          "parentId": 1
        }
      ]
    }
```



## Model: child
* id: integer
* name: string
* *birthday*: date
* createdAt: date
* updatedAt: date
* *parentId*: integer



## Example of  child
```
    {
      "id": 1,
      "name": "string",
      "birthday": "2015-12-31T23:59:59.123",
      "createdAt": "2015-12-31T23:59:59.123",
      "updatedAt": "2015-12-31T23:59:59.123",
      "parentId": 1
    }
```