/**
 * 文件类型: 后端-controller文件
 * 文件路径: @/modules/main/carousel/carousel.controller.js
 * 文件创建日期: 2024/7/11 15:24:47
 * 文件作者: admin
 */
const CarouselService = require('./carousel.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
// 查询轮播图列表
exports.listCarousels = async (req, res) => {
  try {
    const { pageNum, pageSize, ...filters } = req.query;
    const data = await CarouselService.listCarousels(filters, Number(pageNum), Number(pageSize));
    sendSuccess(res, data);
  } catch (error) {
    console.error('查询轮播图列表时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};
// 查询轮播图详细
exports.getCarousel = async (req, res) => {
  try {
    const { carouselId } = req.params;
    const carousel = await CarouselService.getCarouselById(carouselId);
    if (!carousel) {
      return sendError(res, errorCodes.NOT_FOUND);
    }
    sendSuccess(res, {
      data: carousel
    });
  } catch (error) {
    console.error('查询轮播图详细时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};
// 新增轮播图
exports.addCarousel = async (req, res) => {
  try {
    const user = req.user.userName; // 假设用户信息在 req.user 中
    const carousel = await CarouselService.addCarousel(req.body, user);
    sendSuccess(res, carousel);
  } catch (error) {
    console.error('新增轮播图时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};
// 修改轮播图
exports.updateCarousel = async (req, res) => {
  try {
    const user = req.user.userName; // 假设用户信息在 req.user 中
    const { carouselId } = req.body;
    await CarouselService.updateCarousel(carouselId, req.body, user);
    sendSuccess(res, { msg: '更新成功' });
  } catch (error) {
    console.error('修改轮播图时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};
// 删除轮播图
exports.deleteCarousel = async (req, res) => {
  try {
    const { carouselId } = req.params;
    await CarouselService.deleteCarousel(carouselId);
    sendSuccess(res, { msg: '删除成功' });
  } catch (error) {
    console.error('删除轮播图时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};
