const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readFile() {
    try {
      const content = await fs.promises.readFile(this.filePath, 'utf-8');
      const parseContent = JSON.parse(content);
      return parseContent;
    } catch (error) {
      console.log(error);
    }
  }

 
  async #checkProductCode(code) {
    const fileContent = await this.#readFile();
    return fileContent.find((objeto) => objeto.code === code);
  }

  
  async addProduct(obj) {
    const fileContent = await this.#readFile();
    if (await this.#checkProductCode(obj.code)) return console.log(`Error: El producto con el codigo ${obj.code} ya existe.`)

    try {
      if (fileContent.length !== 0) await fs.promises.writeFile(this.filePath, JSON.stringify([...fileContent, { ...obj, id: fileContent[fileContent.length - 1].id + 1 },], null, 2), "utf-8");
      else await fs.promises.writeFile(this.filePath, JSON.stringify([{ ...obj, id: 1 }]), "utf-8");
    } catch (error) {
      console.log(error);
    }
  }
  


  async getProducts() {
    const fileContent = await this.#readFile();

    try {
      if (fileContent.length === 0) throw new Error(`Error: No se encotraron los productos.`);
      else console.log(fileContent);
    } catch (error) {
      console.log(`Error: No se encotraron los productos.`);
    }

  }

 
  async getProductById(id) {
    try {
      const fileContent = await this.#readFile();

      if (!fileContent.find((objeto) => objeto.id === id)) throw new Error(`Error: No se encontraron productos con el id ${id}.`);
      else console.log(fileContent.find((objeto) => objeto.id === id));      
    } catch (error) {
      console.log(`Error: No se encontraron productos con el id ${id}.`);
    }
  }


  async updateProduct(id, obj) {
    try {
      const fileContent = await this.#readFile();
      const updated = fileContent.map((producto) => producto.id === id ? { ...producto, ...obj } : producto);

      if (!fileContent.find((objeto) => objeto.id === id)) throw new Error(`Error: No se encontraron productos con el id ${id}.`);
      else await fs.promises.writeFile(this.filePath, JSON.stringify(updated, null, 4));

    } catch (error) {
      console.log(`Error: No se puede actualizar el producto con el id ${id}.`);
    }
  }

  
  async deleteProductById(id) {
    try {
      const fileContent = await this.#readFile();
      const updated = fileContent.filter((producto) => producto.id !== id);

      if (!fileContent.find((objeto) => objeto.id === id)) throw new Error(`Error: No se encontraron productos con el id  ${id}.`);
      else await fs.promises.writeFile(this.filePath, JSON.stringify(updated, null, 4)); 
    } catch (error) {
      console.log(`Error: no se pudo eliminar el producto con id ${id}.`);
    }
  }


  async deleteAll() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([]), 'utf-8');
  }
}

module.exports = ProductManager;