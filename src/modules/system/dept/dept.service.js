const Dept = require('@/models/system/Dept');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');

// 查询部门列表
const listDepts = async (filters = {}, transaction = null) => {
    try {
        const where = {};

        if (filters.deptName) {
            where.deptName = { [Op.like]: `%${filters.deptName}%` };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const depts = await Dept.findAll({
            where: {
                ...where,
                delFlag: '0'
            },
            order: [['orderNum', 'ASC']],
            transaction
        });

        return depts.map(dept => dept.get());
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

// 构建部门树结构
const buildDeptTree = (depts, parentId = 0) => {
    const tree = [];
    depts.forEach(dept => {
        if (dept.parentId === parentId) {
            const children = buildDeptTree(depts, dept.deptId);
            const node = {
                id: dept.deptId,
                label: dept.deptName,
                children: children.length ? children : undefined
            };
            tree.push(node);
        }
    });
    return tree;
};

// 获取部门下拉树
const getDeptTree = async () => {
    const transaction = await sequelize.transaction();
    try {
        const depts = await listDepts({}, transaction);
        const deptTree = buildDeptTree(depts);
        await transaction.commit();
        return deptTree;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 递归查询所有子部门ID
const getAllDeptIds = async (parentId, transaction = null) => {
    try {
        const depts = await Dept.findAll({
            where: { parentId },
            attributes: ['deptId'],
            transaction
        });

        let ids = depts.map(dept => dept.deptId);

        for (const dept of depts) {
            const childIds = await getAllDeptIds(dept.deptId, transaction);
            ids = ids.concat(childIds);
        }

        return ids;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

// 查询部门详细
const getDeptById = async (deptId) => {
    const transaction = await sequelize.transaction();
    try {
        const dept = await Dept.findByPk(deptId, { transaction });
        await transaction.commit();
        return dept ? dept.get() : null;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 新增部门
const addDept = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        await Dept.create(data, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改部门
const updateDept = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        await Dept.update(data, {
            where: { deptId: data.deptId },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 删除部门
const delDept = async (deptId) => {
    const transaction = await sequelize.transaction();
    try {
        await Dept.destroy({
            where: { deptId },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 查询部门列表（排除节点）
const listDeptExcludeChild = async (deptId) => {
    const transaction = await sequelize.transaction();
    try {
        const allDepts = await Dept.findAll({
            where: {
                status: '0',
                delFlag: '0'
            },
            transaction
        });

        // 获取所有子部门ID
        const excludeDeptIds = await getAllDeptIds(deptId);
        excludeDeptIds.push(Number(deptId));

        const filteredDepts = allDepts.filter(dept => !excludeDeptIds.includes(dept.deptId));

        await transaction.commit();
        return filteredDepts.map(dept => dept.get());
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    listDepts,
    getDeptTree,
    getDeptById,
    buildDeptTree,
    getAllDeptIds,
    addDept,
    updateDept,
    delDept,
    listDeptExcludeChild
};
