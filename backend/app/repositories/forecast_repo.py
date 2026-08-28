"""Goods forecast repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.goods_forecast import GoodsTrainForecast


class GoodsForecastRepository(BaseRepository[GoodsTrainForecast]):
    model = GoodsTrainForecast
