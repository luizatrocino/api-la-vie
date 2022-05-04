const {Psicologos} = require("../models")
const bcrypt = require('bcryptjs')

const controllerPsicologos = {
    async listarPsicologos(req, res) {
        try {
            const listaDePsicologos = await Psicologos.findAll();
            return res.status(200).json(listaDePsicologos);
        }
        catch (error) {
            return res.status(500).json(error.message);
        };
    },
    async listarPsicologosId(req, res) {
        try {
            const { id } = req.params;
            const listaDePsicologos = await Psicologos.findOne({
                where: {
                    id,
                }
            });
            if (listaDePsicologos !== null) res.status(200).json(listaDePsicologos)
            else res.status(404).json("Id não encontrado");
        }
        catch (error) {
            return res.status(500).json("error.message");
        };
    },
    async deletarPsicologo(req, res) {
        try {
            const { id } = req.params;
            const psicologos = await Psicologos.destroy({
                where: {
                    id,
                }
            });
            if (psicologos == 1) res.status(204).json("Psicologo apagado")
            else res.status(404).json("id não encontrado");
        } catch (error) {
            return res.status(500).json("Ocorreu um erro")
        };
    },
    async cadastrarPsicologo(req, res) {
        try {
            const { nome, email, senha, apresentacao } = req.body;
            const newSenha = bcrypt.hashSync(senha,10);
            if (!nome || !email || !senha || !apresentacao) {
                return res
                    .status(400)
                    .json({ error: "Você precisa passar os atributos corretamente" });
            }

            const existsUser = await Psicologos.count({where:{email}})
            
            if (existsUser){
                    return res.status(400).json("E-mail já existe!")
            }

            const novoPsicologo = await Psicologos.create({
                nome,
                email,
                senha: newSenha,
                apresentacao
            });
            res.status(201).json(novoPsicologo);
        } catch (error) {
            return res.status(500).json("error.message")
        }
    },
    async atualizarPsicologo(req, res) {
    const { id } = req.params;
       try {
        const { nome, email, senha, apresentacao } = req.body   
        if (!nome || !email || !senha || !apresentacao) {
            return res
                .status(400)
                .json({ error: "Você precisa passar os atributos corretamente" });
        }    
        const atualizado = await Psicologos.update(
            {
                nome,
                email,
                senha,
                apresentacao
            }, {
                where:{
                    id,
                },
            }
        )
        if(atualizado ==0) return res.status(400).json("id invalido");  
        Psicologos.findByPk(id).then((result) => res.json(result));
        res.status(200);
       } catch (error) {
        return res.status(500).json("error.message")
       }
            
    },
};
module.exports = controllerPsicologos;