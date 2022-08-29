import torch
import uuid
import json
import redis

# connect to redis
r = redis.Redis('redis', 6379)

from diffusers import StableDiffusionPipeline
TOKEN = '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'
# get your token at https://huggingface.co/settings/tokens
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", use_auth_token=TOKEN) #type: ignore
pipe.to('cuda')

# generate a picture from prompt
def generate(prompt, scale, steps, seed):
    generator = torch.Generator("cuda").manual_seed(seed)
    id = str(uuid.uuid1())
    filename = f"{id}.jpg"

    images = pipe(prompt, generator=generator, guidance_scale=scale, num_inference_steps=steps)["sample"] #type: ignore
    images[0].save(f"/outputs/{filename}")
    return id

from flask import Flask, request

app = Flask(__name__)

import threading
import queue
import time

# task queue for generating pictures
q = queue.Queue()

def worker():
    while True:
        # load task from redis
        task_id = q.get()
        task_str = r.get(f't2i:{task_id}')
        if task_str is None:
            return

        task = json.loads(task_str)

        # update status
        print(f'starting text2image job:{task}')

        # generating!
        task['img_id'] = generate(task['prompt'], task['scale'], task['steps'], task['seed'])

        # update status
        task['status'] = 'Done'
        task['finished'] = time.time()
        r.set(f't2i:{task_id}', json.dumps(task)) #type: ignore

        print(f'text2image job done:{task}')
        q.task_done()
        r.set('queue_size', q.qsize())

threading.Thread(target=worker, daemon=True).start()

# default prompt
default_prompt = 'a portrait of a cat playing guitar, made by Pablo Picasso, oil painting, super detailed'

@app.route("/api/txt2img", methods=["GET"])
def txt2img():
    task_id = str(uuid.uuid1())
    task = {
            'type': 'text2image',
            'prompt':  request.args.get('prompt') or default_prompt,
            'scale': float(request.args.get('scale') or 7.5),
            'steps': int(request.args.get('steps') or 50),
            'seed': int(request.args.get('seed') or 1024),
            'author': request.args.get('author') or "",
            'status': 'Pending',
            'created': time.time()
    }

    r.set(f't2i:{task_id}', json.dumps(task), ex=86400) # expires in 1 day
    q.put_nowait(task_id)
    r.set('queue_size', q.qsize())

    return {'ok': True, 'id': task_id}
