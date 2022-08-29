FROM pytorch/pytorch:1.12.1-cuda11.3-cudnn8-runtime
RUN pip install diffusers \
    pip install transformers scipy ftfy \
    pip install "ipywidgets>=7,<8" \
    pip install flask \
    pip install redis \
    pip install gunicorn

RUN mkdir outputs

COPY ./app.py .
VOLUME /outputs
EXPOSE 8080

CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8080", "--reload"]
